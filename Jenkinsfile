pipeline {
    agent any

    environment {
        SCANNER_HOME = tool 'sonar Scanner'
        SONAR_ENV="sonar"
        SONAR_PROJECT_KEY="tarot-game-engine"
    }

    post {
        failure {
            updateGitlabCommitStatus name: 'build', state: 'failed'
        }
        success {
            updateGitlabCommitStatus name: 'build', state: 'success'
        }
    }
    options {
        gitLabConnection('gitlab')
    }
    triggers {
        gitlab(triggerOnPush: true, triggerOnMergeRequest: true, branchFilterType: 'All')
    }

    tools {
        nodejs "node14"
    }
    stages {

        stage('Build') {
            steps {
                sh 'npm install && npm run test'
            }
        }

        stage('SonarQube analysis') {
            steps {
                withSonarQubeEnv(env.SONAR_ENV) {
                    sh "${env.SCANNER_HOME}/bin/sonar-scanner -Dsonar.projectKey=${env.SONAR_PROJECT_KEY} -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info -Dsonar.sources=src -Dsonar.tests=src -Dsonar.test.inclusions=**/*.spec.ts"
                }
            }
        }
    }
}
