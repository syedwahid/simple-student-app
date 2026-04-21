pipeline {
    agent any
    
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
        
        stage('Load and Deploy') {
            steps {
                sh '''
                    # Load image to KIND
                    echo "Loading image to KIND cluster..."
                    kind load docker-image simple-student-app:latest --name student-app
                    
                    # Setup kubeconfig
                    export KUBECONFIG=/root/.kube/config
                    
                    # Create namespace
                    kubectl create namespace student-app --dry-run=client -o yaml | kubectl apply -f -
                    
                    # Deploy
                    kubectl apply -f k8s-deployment.yaml
                    
                    # Wait for pods
                    echo "Waiting for pods to be ready..."
                    sleep 20
                    
                    # Show status
                    kubectl get pods -n student-app
                    kubectl get svc -n student-app
                '''
            }
        }
        
        stage('Verify') {
            steps {
                sh '''
                    export KUBECONFIG=/root/.kube/config
                    NODE_PORT=$(kubectl get svc student-app-service -n student-app -o jsonpath='{.spec.ports[0].nodePort}')
                    echo "═══════════════════════════════════════════════════════════"
                    echo "✅ DEPLOYMENT SUCCESSFUL!"
                    echo "═══════════════════════════════════════════════════════════"
                    echo ""
                    echo "🌐 ACCESS YOUR APPLICATION:"
                    echo "   URL: http://localhost:${NODE_PORT}"
                    echo "   API: http://localhost:${NODE_PORT}/api/students"
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
