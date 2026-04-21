pipeline {
    agent any
    
    environment {
        APP_NAME = "simple-student-app"
        K8S_NAMESPACE = "student-app"
        DOCKER_IMAGE = "simple-student-app:latest"
        DOCKER_REGISTRY = ""  # Leave empty for local KIND
    }
    
    tools {
        nodejs 'nodejs'  // Optional: if you have NodeJS tool configured
    }
    
    stages {
        stage('📦 Checkout') {
            steps {
                echo 'Cloning repository from GitHub...'
                checkout scm
                echo "✅ Code checked out from ${env.GIT_URL}"
                sh 'ls -la'
            }
        }
        
        stage('🔨 Build Docker Image') {
            steps {
                echo 'Building Docker image...'
                sh '''
                    echo "Building image: ${DOCKER_IMAGE}"
                    docker build -t ${DOCKER_IMAGE} .
                    docker images | grep ${APP_NAME}
                '''
                echo '✅ Docker image built successfully'
            }
        }
        
        stage('📤 Load to KIND Cluster') {
            steps {
                echo 'Loading image to KIND cluster...'
                sh '''
                    echo "Loading image to KIND cluster: student-app"
                    kind load docker-image ${DOCKER_IMAGE} --name student-app
                '''
                echo '✅ Image loaded to KIND'
            }
        }
        
        stage('🚀 Deploy to Kubernetes') {
            steps {
                echo 'Deploying application to Kubernetes...'
                sh '''
                    # Create namespace if not exists
                    kubectl create namespace ${K8S_NAMESPACE} --dry-run=client -o yaml | kubectl apply -f -
                    
                    # Deploy application
                    kubectl apply -f k8s-deployment.yaml
                    
                    # Wait for deployment to complete
                    echo "Waiting for deployment to be ready..."
                    kubectl rollout status deployment/${APP_NAME} -n ${K8S_NAMESPACE} --timeout=90s
                '''
                echo '✅ Deployment complete'
            }
        }
        
        stage('🔍 Verify Deployment') {
            steps {
                echo 'Verifying deployment...'
                sh '''
                    echo "📊 Pod Status:"
                    kubectl get pods -n ${K8S_NAMESPACE}
                    
                    echo ""
                    echo "🌐 Service Status:"
                    kubectl get svc -n ${K8S_NAMESPACE}
                    
                    echo ""
                    echo "🧪 Testing Application..."
                    
                    # Test if pods are running
                    POD_COUNT=$(kubectl get pods -n ${K8S_NAMESPACE} -l app=${APP_NAME} --field-selector=status.phase=Running --no-headers | wc -l)
                    echo "Running pods: ${POD_COUNT}/2"
                    
                    # Get service node port
                    NODE_PORT=$(kubectl get svc ${APP_NAME}-service -n ${K8S_NAMESPACE} -o jsonpath='{.spec.ports[0].nodePort}')
                    echo "Application available at: http://localhost:${NODE_PORT}"
                '''
                echo '✅ Verification complete'
            }
        }
        
        stage('📊 Display Access Info') {
            steps {
                echo 'Application Access Information...'
                sh '''
                    echo "═══════════════════════════════════════════════════════════"
                    echo "🎉 DEPLOYMENT SUCCESSFUL!"
                    echo "═══════════════════════════════════════════════════════════"
                    echo ""
                    NODE_PORT=$(kubectl get svc ${APP_NAME}-service -n ${K8S_NAMESPACE} -o jsonpath='{.spec.ports[0].nodePort}')
                    echo "🌐 ACCESS YOUR APPLICATION:"
                    echo "   URL: http://localhost:${NODE_PORT}"
                    echo "   API: http://localhost:${NODE_PORT}/api/students"
                    echo "   Health: http://localhost:${NODE_PORT}/api/health"
                    echo ""
                    echo "📊 MANAGE DEPLOYMENT:"
                    echo "   kubectl get pods -n ${K8S_NAMESPACE}"
                    echo "   kubectl logs -n ${K8S_NAMESPACE} deployment/${APP_NAME}"
                    echo "   kubectl delete namespace ${K8S_NAMESPACE}"
                    echo "═══════════════════════════════════════════════════════════"
                '''
            }
        }
    }
    
    post {
        success {
            echo '🎉 CI/CD Pipeline completed successfully!'
            currentBuild.description = "✅ Deployed to K8s - Access at port 30080"
        }
        failure {
            echo '❌ Pipeline failed!'
            currentBuild.description = "❌ Build failed - Check console output"
            
            // Print logs for debugging
            sh '''
                echo "=== DEBUGGING INFORMATION ==="
                echo "KIND clusters:"
                kind get clusters
                echo ""
                echo "Docker images:"
                docker images | grep simple-student-app || echo "Image not found"
                echo ""
                echo "Kubernetes pods:"
                kubectl get pods -n ${K8S_NAMESPACE} 2>/dev/null || echo "No pods found"
            '''
        }
        always {
            echo "Build #${BUILD_NUMBER} completed on ${new Date()}"
        }
    }
}
