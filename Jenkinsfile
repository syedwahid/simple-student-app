pipeline {
    agent any
    
    stages {
        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                    echo "Triggering deployment on HOST via SSH..."
                    ssh -i /var/jenkins_home/.ssh/jenkins_host -o StrictHostKeyChecking=no syedwahid@host.docker.internal "~/deploy-to-k8s.sh"
                '''
            }
        }
        
        stage('Verify') {
            steps {
                sh '''
                    echo "═══════════════════════════════════════════════════════════"
                    echo "✅ DEPLOYMENT TRIGGERED SUCCESSFULLY!"
                    echo "═══════════════════════════════════════════════════════════"
                    echo ""
                    echo "🌐 Application URL: http://localhost:30080"
                    echo ""
                '''
            }
        }
    }
}
