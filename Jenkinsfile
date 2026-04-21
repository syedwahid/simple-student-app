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
        
        stage('Deploy to KIND') {
            steps {
                sh '''
                    # Use host IP for kubectl
                    export HOST_IP=$(ip route | grep docker0 | awk '{print $9}' | cut -d'/' -f1)
                    if [ -z "$HOST_IP" ]; then
                        export HOST_IP="172.17.0.1"
                    fi
                    
                    # Get KIND port
                    export KIND_PORT=$(docker inspect student-app-control-plane --format='{{(index (index .NetworkSettings.Ports "6443/tcp") 0).HostPort}}' 2>/dev/null)
                    if [ -z "$KIND_PORT" ]; then
                        export KIND_PORT="6443"
                    fi
                    
                    # Create kubeconfig
                    mkdir -p $HOME/.kube
                    cat > $HOME/.kube/config << K8SCONFIG
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
                    
                    # Deploy
                    kubectl create namespace student-app --dry-run=client -o yaml | kubectl apply -f -
                    kubectl apply -f k8s-deployment.yaml
                    
                    # Wait for pods
                    sleep 15
                    kubectl get pods -n student-app
                    kubectl get svc -n student-app
                '''
            }
        }
    }
    
    post {
        success {
            echo '✅ Deployment successful! Access at http://localhost:30080'
        }
        failure {
            echo '❌ Deployment failed!'
        }
    }
}
