pipeline {
    agent any

    stages {

        stage('Clone Frontend Repo') {
            steps {
                git branch: 'main', url: 'https://github.com/arshhad45/money-manager-frontend.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                docker build \
                --build-arg VITE_API_URL=http://18.208.134.172:5000 \
                -t money-frontend .
                '''
            }
        }
        stage('Deploy Frontend Container') {
            steps {
                sh 'docker rm -f frontend-container || true'
                sh 'docker run -d -p 3000:80 --name frontend-container money-frontend'
            }
        }

    }
}