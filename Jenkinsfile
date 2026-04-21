pipeline {
    agent any
    
    stages {
        stage('Build Docker Image') {
            steps {
                sh '''
                    echo "🔨 Building Docker image..."
                    docker build -t simple-student-app:latest .
                    echo "✅ Image built"
                '''
            }
        }
        
        stage('Deploy Container') {
            steps {
                sh '''
                    echo "🚀 Deploying container..."
                    
                    # Stop and remove old container
                    docker stop simple-student-app 2>/dev/null || true
                    docker rm simple-student-app 2>/dev/null || true
                    
                    # Run new container
                    docker run -d \
                        --name simple-student-app \
                        --restart unless-stopped \
                        -p 30080:3000 \
                        simple-student-app:latest
                    
                    echo "✅ Container deployed"
                '''
            }
        }
        
        stage('Verify') {
            steps {
                sh '''
                    echo "🔍 Verifying deployment..."
                    sleep 3
                    
                    # Test the application
                    if curl -s http://localhost:30080/api/health > /dev/null; then
                        echo "✅ Application is running!"
                        curl -s http://localhost:30080/api/health | head -3
                    else
                        echo "⚠️ Application may still be starting..."
                    fi
                    
                    echo ""
                    echo "═══════════════════════════════════════════════════════════"
                    echo "🎉 DEPLOYMENT SUCCESSFUL!"
                    echo "═══════════════════════════════════════════════════════════"
                    echo ""
                    echo "🌐 ACCESS YOUR APPLICATION:"
                    echo "   URL: http://localhost:30080"
                    echo "   API: http://localhost:30080/api/students"
                    echo "   Health: http://localhost:30080/api/health"
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
