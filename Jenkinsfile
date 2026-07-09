pipeline {
  agent any

  environment {
    NODE_ENV  = 'test'
    BUILD_DIR = 'dist'
    APP_NAME  = 'kijanikiosk-payments'
  }

  options {
    timeout(time: 15, unit: 'MINUTES')
    buildDiscarder(logRotator(numToKeepStr: '10'))
    disableConcurrentBuilds()
  }

  stages {
    stage('Build') {
      steps {
        echo "Installing dependencies for ${APP_NAME}..."
        sh 'npm ci'

        echo "Building application..."
        sh 'npm run build'

        echo "Verifying build output..."
        sh '''
          set -e
          test -d "${BUILD_DIR}" || { echo "ERROR: build directory not found"; exit 1; }
          FILE_COUNT=$(find "${BUILD_DIR}" -type f | wc -l)
          echo "Build output: ${FILE_COUNT} files in ${BUILD_DIR}/"
          test "${FILE_COUNT}" -gt 0 || { echo "ERROR: build directory is empty"; exit 1; }
        '''
      }
    }

    stage('Test') {
      steps {
        echo "Running test suite for ${APP_NAME}..."
        sh '''
          set -e
          npm test
        '''
      }
      post {
        always {
          junit allowEmptyResults: true, testResults: 'test-results/*.xml'
        }
      }
    }

    stage('Archive') {
      steps {
        echo "Archiving build artifact for ${APP_NAME} build ${BUILD_NUMBER}..."
        archiveArtifacts artifacts: "${BUILD_DIR}/**", fingerprint: true, onlyIfSuccessful: true
        echo "Artifact URL: ${BUILD_URL}artifact/"
      }
    }
  }

  post {
    success {
      echo "SUCCESS: ${APP_NAME} build #${BUILD_NUMBER} passed. Artifact URL: ${BUILD_URL}artifact/"
    }

    failure {
      echo "FAILURE: ${APP_NAME} build #${BUILD_NUMBER} failed. Check the console log for the failed stage."
    }

    always {
      cleanWs()
    }
  }
}