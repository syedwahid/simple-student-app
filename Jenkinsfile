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
        
        stage('Setup KIND Cluster') {
            steps {
                sh '''
                    # Check if KIND cluster exists, create if not
                    if ! kind get clusters 2>/dev/null | grep -q student-app; then
                        echo "Creating KIND cluster..."
                        kind create cluster --name student-app --wait 2m
                    else
                        echo "KIND cluster already exists"
                    fi
                    
                    # Ensure kubeconfig is set up
                    kind export kubeconfig --name student-app --kubeconfig /var/jenkins_home/.kube/config
                    kubectl cluster-info
                '''
            }
        }
        
        stage('Load Image to KIND') {
            steps {
                sh '''
                    echo "Loading image to KIND cluster..."
                    kind load docker-image simple-student-app:latest --name student-app
                '''
            }
        }
        
        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                    # Create namespace
                    kubectl create namespace student-app --dry-run=client -o yaml | kubectl apply -f -
                    
                    # Deploy application
                    kubectl apply -f k8s-deployment.yaml
                    
                    # Wait for deployment
                    echo "Waiting for deployment..."
                    kubectl wait --for=condition=ready pod -l app=simple-student-app -n student-app --timeout=90s || true
                '''
            }
        }
        
        stage('Verify Deployment') {
            steps {
                sh '''
                    echo "📊 Pod Status:"
                    kubectl get pods -n student-app
                    echo ""
                    echo "🌐 Service Status:"
                    kubectl get svc -n student-app
                    echo ""
                    
                    # Get node port
                    NODE_PORT=$(kubectl get svc student-app-service -n student-app -o jsonpath='{.spec.ports[0].nodePort}')
                    echo "✅ Application available at: http://localhost:${NODE_PORT}"
                '''
            }
        }
    }
    
    post {
        success {
            echo '🎉 Pipeline completed successfully!'
            echo '🌐 Access your app at: http://localhost:30080'
        }
        failure {
            echo '❌ Pipeline failed!'
            sh '''
                echo "Debug:"
                kind get clusters
                docker images | grep simple-student-app
            '''
        }
    }
}
