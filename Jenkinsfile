pipeline {
  agent {
    kubernetes {
      yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: jenkins-agent
    image: jenkins/inbound-agent:latest
    command:
    - sleep
    args:
    - infinity
  - name: docker
    image: docker:dind
    securityContext:
      privileged: true
    env:
    - name: DOCKER_TLS_CERTDIR
      value: ""
  - name: aws
    image: "alpine/k8s:1.28.0"
    command:
    - sleep
    args:
    - infinity
  - name: kubectl
    image: "alpine/k8s:1.28.0"
    command:
    - sleep
    args:
    - infinity
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
        container('jenkins-agent') {
          checkout scm
          echo "✅ Code checked out — Build #${BUILD_NUMBER}"
        }
      }
    }

    stage('🐳 Build & Push to ECR') {
      steps {
        container('docker') {
          sh """
            sleep 5
            docker info
            apk add --no-cache aws-cli || true
            aws ecr get-login-password --region ${AWS_REGION} | \
            docker login --username AWS --password-stdin \
            ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
            docker build -t ${FRONTEND_REPO}:${BUILD_NUMBER} .
            docker tag ${FRONTEND_REPO}:${BUILD_NUMBER} ${FRONTEND_REPO}:latest
            docker push ${FRONTEND_REPO}:${BUILD_NUMBER}
            docker push ${FRONTEND_REPO}:latest
          """
        }
      }
    }

    stage('🚀 Deploy to EKS') {
  steps {
    container('kubectl') {
      sh """
        aws eks update-kubeconfig --name ${CLUSTER_NAME} --region ${AWS_REGION}

        kubectl create namespace production --dry-run=client -o yaml | kubectl apply -f -

        cat <<'EOF' | kubectl apply -f -
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
      """
    }
  }
}

    stage('🌐 Get App URL') {
      steps {
        container('kubectl') {
          sh """
            sleep 20
            kubectl get svc frontend-service -n production
          """
        }
      }
    }
  }

  post {
    success { echo '✅ Frontend deployed successfully!' }
    failure { echo '❌ Frontend deploy failed!' }
  }
}