pipeline {
  agent any

  environment {
    AWS_ACCOUNT_ID  = '481665097478'
    AWS_REGION      = 'us-east-1'
    CLUSTER_NAME    = 'devops-cluster'
    FRONTEND_REPO   = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/devops-app-frontend"
  }

  stages {

    stage('📥 Checkout Code') {
      steps {
        checkout scm
        echo "✅ Code checked out from: arshhad45/money-manager-frontend"
        echo "✅ Build number: ${BUILD_NUMBER}"
      }
    }

    stage('🐳 Build Frontend Docker Image') {
      steps {
        sh "docker build -t ${FRONTEND_REPO}:${BUILD_NUMBER} ."
        sh "docker tag ${FRONTEND_REPO}:${BUILD_NUMBER} ${FRONTEND_REPO}:latest"
        echo "✅ Frontend image built: ${FRONTEND_REPO}:${BUILD_NUMBER}"
      }
    }

    stage('🔍 Security Scan') {
      steps {
        sh "docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy:latest image --severity HIGH,CRITICAL --exit-code 0 ${FRONTEND_REPO}:${BUILD_NUMBER}"
        echo "✅ Security scan complete"
      }
    }

    stage('📤 Push Frontend to ECR') {
      steps {
        sh """
          aws ecr get-login-password --region ${AWS_REGION} | \
          docker login --username AWS --password-stdin \
          ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
        """
        sh "docker push ${FRONTEND_REPO}:${BUILD_NUMBER}"
        sh "docker push ${FRONTEND_REPO}:latest"
        echo "✅ Frontend image pushed to ECR"
      }
    }

    stage('🚀 Deploy Frontend to EKS') {
      steps {
        sh "aws eks update-kubeconfig --name ${CLUSTER_NAME} --region ${AWS_REGION}"
        sh "kubectl create namespace production --dry-run=client -o yaml | kubectl apply -f -"
        sh """
          kubectl create deployment frontend \
            --image=${FRONTEND_REPO}:${BUILD_NUMBER} \
            --namespace production \
            --dry-run=client -o yaml | kubectl apply -f -
        """
        sh "kubectl set image deployment/frontend frontend=${FRONTEND_REPO}:${BUILD_NUMBER} -n production"
        sh """
          kubectl expose deployment frontend \
            --port=80 \
            --target-port=80 \
            --type=LoadBalancer \
            --name=frontend-service \
            --namespace production \
            --dry-run=client -o yaml | kubectl apply -f -
        """
        sh "kubectl rollout status deployment/frontend -n production --timeout=5m"
        echo "✅ Frontend deployed to EKS"
      }
    }

    stage('🌐 Get Live URL') {
      steps {
        script {
          sleep(20)
          def url = sh(
            script: "kubectl get svc frontend-service -n production -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'",
            returnStdout: true
          ).trim()
          echo "🚀 YOUR APP IS LIVE AT: http://${url}"
        }
      }
    }
  }

  post {
    success {
      echo '✅ Frontend pipeline completed successfully!'
      echo "🌐 Image: ${FRONTEND_REPO}:${BUILD_NUMBER}"
    }
    failure {
      echo '❌ Frontend pipeline failed!'
      echo 'Run: kubectl get pods -n production'
      echo 'Run: kubectl logs deployment/frontend -n production'
    }
    always {
      sh 'docker rmi ${FRONTEND_REPO}:${BUILD_NUMBER} || true'
      sh 'docker system prune -f || true'
    }
  }
}
