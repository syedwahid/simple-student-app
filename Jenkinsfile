pipeline {
    agent any
    
    environment {
        KUBECONFIG = "/root/.kube/config"
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build Docker Image') {
            steps {
                sh 'docker build -t simple-student-app:latest .'
            }
        }
        
        stage('Deploy') {
            steps {
                sh '''
                    # Load image to KIND
                    kind load docker-image simple-student-app:latest --name student-app
                    
                    # Deploy using kubectl with explicit kubeconfig
                    kubectl --kubeconfig=/root/.kube/config create namespace student-app --dry-run=client -o yaml | kubectl --kubeconfig=/root/.kube/config apply -f -
                    kubectl --kubeconfig=/root/.kube/config apply -f k8s-deployment.yaml
                    
                    # Wait for pods
                    sleep 15
                    kubectl --kubeconfig=/root/.kube/config get pods -n student-app
                    kubectl --kubeconfig=/root/.kube/config get svc -n student-app
                '''
            }
        }
        
        stage('Verify') {
            steps {
                sh '''
                    NODE_PORT=$(kubectl --kubeconfig=/root/.kube/config get svc student-app-service -n student-app -o jsonpath='{.spec.ports[0].nodePort}')
                    echo "═══════════════════════════════════════════════════════════"
                    echo "✅ DEPLOYMENT SUCCESSFUL!"
                    echo "═══════════════════════════════════════════════════════════"
                    echo ""
                    echo "🌐 ACCESS YOUR APPLICATION:"
                    echo "   URL: http://localhost:${NODE_PORT}"
                    echo ""
                '''
            }
        }
    }
    
    post {
        success {
            echo '🎉 Pipeline completed successfully!'
        }
        failure {
            echo '❌ Pipeline failed!'
        }
    }
}
