node {
    stage('Clone repository') {
        checkout scm
    }
    stage('Dependencies Server') {
        sh 'npm i'
    }
    stage('Build Server') {
        sh 'npm run build --prod'
    }
    stage('Dependencies Client') {
        dir('client') {
            sh 'npm i'
        }
    }
    stage('Build Client') {
        dir('client') {
            sh 'npm run build --prod'
        }
    }
    stage('Build image') {
        docker.build("alexanderwyss/sonos-assistant")
    }
    stage('Deploy') {
        sh 'docker stop sonos-assistant || true && docker rm -f sonos-assistant || true'
        sh 'docker run -d --expose 8080 --restart unless-stopped --name sonos-assistant -v /docker/tts:/usr/src/app/dist/tts -e PORT=8080 -e VIRTUAL_HOST=sonos.wyss.tech -e VIRTUAL_PORT=8080 -e LETSENCRYPT_HOST=sonos.wyss.tech alexanderwyss/sonos-assistant:latest'
    }
}
