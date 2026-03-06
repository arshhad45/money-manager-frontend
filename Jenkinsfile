pipeline {
  agent any

  environment {
    AWS_ACCOUNT_ID        = '481665097478'
    AWS_REGION            = 'us-east-1'
    CLUSTER_NAME          = 'devops-cluster'
    FRONTEND_REPO         = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/devops-app-frontend"
    AWS_ACCESS_KEY_ID     = credentials('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY = credentials('AWS_SECRET_ACCESS_KEY')
  }

  stages {

    stage('📥 Checkout') {
      steps {
        checkout scm
        echo "✅ Code checked out — Build #${BUILD_NUMBER}"
      }
    }

    stage('🐳 Build & Push to ECR') {
      steps {
        sh """
          # Install required tools
          apt-get update -qq && apt-get install -y docker.io awscli || \
          yum install -y docker awscli || \
          apk add --no-cache docker aws-cli || true

          # Configure AWS
          export AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
          export AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
          export AWS_DEFAULT_REGION=${AWS_REGION}

          # Login to ECR
          aws ecr get-login-password --region ${AWS_REGION} | \
          docker login --username AWS --password-stdin \
          ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com

          # Build and push
          docker build -t ${FRONTEND_REPO}:${BUILD_NUMBER} .
          docker tag ${FRONTEND_REPO}:${BUILD_NUMBER} ${FRONTEND_REPO}:latest
          docker push ${FRONTEND_REPO}:${BUILD_NUMBER}
          docker push ${FRONTEND_REPO}:latest
        """
      }
    }

    stage('🚀 Deploy to EKS') {
      steps {
        sh """
          export AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
          export AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
          export AWS_DEFAULT_REGION=${AWS_REGION}

          aws eks update-kubeconfig --name ${CLUSTER_NAME} --region ${AWS_REGION}

          kubectl create namespace production --dry-run=client -o yaml | kubectl apply -f -

          kubectl create deployment frontend \
            --image=${FRONTEND_REPO}:${BUILD_NUMBER} \
            --namespace production \
            --dry-run=client -o yaml | kubectl apply -f -

          kubectl set image deployment/frontend \
            frontend=${FRONTEND_REPO}:${BUILD_NUMBER} \
            -n production

          kubectl expose deployment frontend \
            --port=80 \
            --target-port=80 \
            --type=LoadBalancer \
            --name=frontend-service \
            --namespace production \
            --dry-run=client -o yaml | kubectl apply -f -

          kubectl rollout status deployment/frontend \
            -n production --timeout=5m
        """
      }
    }

    stage('🌐 Get App URL') {
      steps {
        sh """
          export AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
          export AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
          export AWS_DEFAULT_REGION=${AWS_REGION}
          sleep 20
          kubectl get svc frontend-service -n production
        """
      }
    }
  }

  post {
    success { echo '✅ Frontend deployed successfully!' }
    failure { echo '❌ Frontend deploy failed!' }
  }
}
