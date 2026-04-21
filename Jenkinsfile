pipeline {
    agent any
    
    stages {
        stage('Build Docker Image') {
            steps {
                sh '''
                    echo "🔨 Building Docker image..."
                    docker build -t simple-student-app:latest .
                    echo "✅ Image built successfully"
                '''
            }
        }
        
        stage('Load to KIND Cluster') {
            steps {
                sh '''
                    echo "📤 Loading image to KIND cluster..."
                    kind load docker-image simple-student-app:latest --name student-app
                    echo "✅ Image loaded to KIND"
                '''
            }
        }
        
        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                    echo "🚀 Deploying to Kubernetes..."
                    
                    # Use the kubeconfig we already set up
                    export KUBECONFIG=/root/.kube/config
                    
                    # Create namespace if needed
                    kubectl create namespace student-app --dry-run=client -o yaml | kubectl apply -f -
                    
                    # Deploy the application
                    kubectl apply -f k8s-deployment.yaml
                    
                    # Show deployment status
                    echo ""
                    echo "📊 Deployment Status:"
                    kubectl get pods -n student-app
                    kubectl get svc -n student-app
                    
                    echo ""
                    echo "✅ Deployment complete!"
                '''
            }
        }
        
        stage('Display Info') {
            steps {
                sh '''
                    echo "═══════════════════════════════════════════════════════════"
                    echo "🎉 DEPLOYMENT SUCCESSFUL!"
                    echo "═══════════════════════════════════════════════════════════"
                    echo ""
                    echo "🌐 ACCESS YOUR APPLICATION:"
                    echo "   URL: http://localhost:30080"
                    echo "   API: http://localhost:30080/api/students"
                    echo "   Health: http://localhost:30080/api/health"
                    echo ""
                    echo "📊 Check status:"
                    echo "   kubectl get pods -n student-app"
                    echo "   kubectl logs -n student-app deployment/simple-student-app"
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
            sh '''
                echo "Debug info:"
                docker images | grep simple-student-app
                kind get clusters
            '''
        }
    }
}
