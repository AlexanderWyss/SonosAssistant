node {
    def dockerImage
    stage('Clone repository') {
        checkout scm
    }
    stage('Build image') {
        dockerImage = docker.build("alexanderwyss/sonos-assistant")
    }
    stage('Push image') {
        String version = "1";
        docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-credentials') {
            dockerImage.push(version)
            dockerImage.push("latest")
        }
    }
    stage('Deploy') {
        sh 'docker pull alexanderwyss/sonos-assistant:latest'
        sh 'docker stop sonos-assistant || true && docker rm -f sonos-assistant || true'
        sh 'docker run -d --expose 8080 --restart unless-stopped --name sonos-assistant -e PORT=8080 -e VIRTUAL_HOST=sonos.wyss.tech -e VIRTUAL_PORT=8080 -e LETSENCRYPT_HOST=sonos.wyss.tech alexanderwyss/sonos-assistant:latest'
    }
}
