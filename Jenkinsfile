pipeline {
    agent any
    
    environment {
        KUBECONFIG = "/var/jenkins_home/.kube/config"
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
        
        stage('Setup Kubeconfig') {
            steps {
                script {
                    sh '''
                        # Get host IP
                        HOST_IP=$(ip route | grep docker0 | awk '{print $9}' | cut -d'/' -f1)
                        if [ -z "$HOST_IP" ]; then
                            HOST_IP="172.17.0.1"
                        fi
                        
                        # Get KIND port
                        KIND_PORT=$(docker inspect student-app-control-plane --format='{{(index (index .NetworkSettings.Ports "6443/tcp") 0).HostPort}}' 2>/dev/null)
                        if [ -z "$KIND_PORT" ]; then
                            KIND_PORT="6443"
                        fi
                        
                        # Create kubeconfig directory
                        mkdir -p /var/jenkins_home/.kube
                        
                        # Write kubeconfig
                        cat > /var/jenkins_home/.kube/config << K8SCONFIG
apiVersion: v1
kind: Config
clusters:
- cluster:
    server: https://${HOST_IP}:${KIND_PORT}
    insecure-skip-tls-verify: true
  name: kind-student-app
contexts:
- context:
    cluster: kind-student-app
    user: kind-student-app
  name: kind-student-app
current-context: kind-student-app
users:
- name: kind-student-app
  user: {}
K8SCONFIG
                        
                        chmod 600 /var/jenkins_home/.kube/config
                        echo "✅ Kubeconfig created"
                        cat /var/jenkins_home/.kube/config
                    '''
                }
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
                    echo "Deploying to Kubernetes..."
                    
                    # Create namespace
                    kubectl create namespace student-app --dry-run=client -o yaml | kubectl apply -f -
                    
                    # Deploy application
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
        
        stage('Verify Deployment') {
            steps {
                sh '''
                    NODE_PORT=$(kubectl get svc student-app-service -n student-app -o jsonpath='{.spec.ports[0].nodePort}')
                    echo "═══════════════════════════════════════════════════════════"
                    echo "✅ DEPLOYMENT SUCCESSFUL!"
                    echo "═══════════════════════════════════════════════════════════"
                    echo ""
                    echo "🌐 ACCESS YOUR APPLICATION:"
                    echo "   URL: http://localhost:${NODE_PORT}"
                    echo "   API: http://localhost:${NODE_PORT}/api/students"
                    echo "   Health: http://localhost:${NODE_PORT}/api/health"
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
                echo "Debug information:"
                echo "Kubeconfig:"
                ls -la /var/jenkins_home/.kube/
                echo ""
                echo "KIND clusters:"
                kind get clusters
            '''
        }
    }
}
