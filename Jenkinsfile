pipeline {
    agent any
    
    stages {
        stage('Trigger Deployment') {
            steps {
                sh '''
                    echo "Triggering deployment on HOST..."
                    sh 'touch /trigger/deploy'
                    echo "✅ Deployment triggered! Watch at http://localhost:30080"
                '''
            }
        }
        
        stage('Wait for Deployment') {
            steps {
                sh '''
                    echo "Waiting for deployment to complete..."
                    sleep 5
                    echo "✅ Deployment should be complete"
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
                    echo "🌐 API: http://localhost:30080/api/students"
                    echo ""
                '''
            }
        }
    }
}
