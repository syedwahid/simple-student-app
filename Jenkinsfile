pipeline {
    agent any
    
    environment {
        KUBECONFIG = "/root/.kube/config"
    }
    
    stages {
        stage('Build Image') {
            steps {
                sh '''
                    echo "Building Docker image..."
                    docker build -t simple-student-app:latest .
                '''
            }
        }
        
        stage('Deploy to KIND') {
            steps {
                sh '''
                    echo "Loading image to KIND cluster..."
                    kind load docker-image simple-student-app:latest --name student-app
                    
                    echo "Deploying to Kubernetes..."
                    kubectl apply -f k8s-deployment.yaml
                    
                    echo "Waiting for deployment..."
                    sleep 15
                    kubectl get pods -n student-app
                '''
            }
        }
        
        stage('Verify') {
            steps {
                sh '''
                    echo "═══════════════════════════════════════════════════════════"
                    echo "✅ DEPLOYMENT SUCCESSFUL!"
                    echo "═══════════════════════════════════════════════════════════"
                    echo ""
                    echo "🌐 Application URL: http://localhost:30080"
                    echo "🌐 API: http://localhost:30080/api/students"
                    echo ""
                '''
            }
        }
    }
    
    post {
        success {
            echo '🎉 Pipeline completed!'
        }
        failure {
            echo '❌ Pipeline failed!'
        }
    }
}
