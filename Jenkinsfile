pipeline {
  agent {
    kubernetes {
      yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: jnlp
    image: jenkins/inbound-agent:latest
    volumeMounts:
    - mountPath: /home/jenkins/agent
      name: workspace-volume
  - name: docker
    image: docker:dind
    securityContext:
      privileged: true
    env:
    - name: DOCKER_TLS_CERTDIR
      value: ""
    volumeMounts:
    - mountPath: /home/jenkins/agent
      name: workspace-volume
  - name: tools
    image: alpine/k8s:1.28.0
    command:
    - sleep
    args:
    - infinity
    volumeMounts:
    - mountPath: /home/jenkins/agent
      name: workspace-volume
  volumes:
  - name: workspace-volume
    emptyDir: {}
"""
    }
  }

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
        container('docker') {
          sh """
            sleep 5
            docker info

            apk add --no-cache aws-cli

            export AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
            export AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
            export AWS_DEFAULT_REGION=${AWS_REGION}

            aws ecr get-login-password --region ${AWS_REGION} | \
            docker login --username AWS --password-stdin \
            ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com

            docker build -t ${FRONTEND_REPO}:${BUILD_NUMBER} .
            docker tag ${FRONTEND_REPO}:${BUILD_NUMBER} ${FRONTEND_REPO}:latest
            docker push ${FRONTEND_REPO}:${BUILD_NUMBER}
            docker push ${FRONTEND_REPO}:latest

            echo "✅ Image pushed to ECR successfully!"
          """
        }
      }
    }

    stage('🚀 Deploy to EKS') {
      steps {
        container('tools') {
          sh """
            export AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
            export AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
            export AWS_DEFAULT_REGION=${AWS_REGION}

            aws eks update-kubeconfig --name ${CLUSTER_NAME} --region ${AWS_REGION}

            kubectl create namespace production --dry-run=client -o yaml | kubectl apply -f -

            cat <<EOF | kubectl apply -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  namespace: production
spec:
  replicas: 2
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: ${FRONTEND_REPO}:${BUILD_NUMBER}
        ports:
        - containerPort: 80
        readinessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 10
          periodSeconds: 5
        livenessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 20
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: frontend-service
  namespace: production
spec:
  type: LoadBalancer
  selector:
    app: frontend
  ports:
  - port: 80
    targetPort: 80
EOF

            kubectl rollout status deployment/frontend -n production --timeout=5m
            echo "✅ Frontend deployed successfully!"
          """
        }
      }
    }

    stage('🌐 Get App URL') {
      steps {
        container('tools') {
          sh """
            export AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
            export AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
            export AWS_DEFAULT_REGION=${AWS_REGION}

            echo "⏳ Waiting for LoadBalancer URL..."
            sleep 30
            kubectl get svc frontend-service -n production
            echo "✅ Your app URL is shown above under EXTERNAL-IP!"
          """
        }
      }
    }
  }

  post {
    success { echo '✅ Frontend pipeline completed successfully!' }
    failure { echo '❌ Frontend pipeline failed!' }
  }
}