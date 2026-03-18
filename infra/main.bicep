// Azure Static Web Apps infrastructure for B-Körkortsappen
// Deploys a Free-tier Static Web App for hosting the Vite/React SPA

@description('The Azure region for the Static Web App. Defaults to West Europe.')
param location string = 'westeurope'

@description('The name of the Static Web App resource.')
@minLength(1)
@maxLength(40)
param staticWebAppName string = 'swa-drivers-license'

@description('The SKU for the Static Web App.')
@allowed(['Free', 'Standard'])
param skuName string = 'Free'

// Static Web App resource
resource staticWebApp 'Microsoft.Web/staticSites@2024-04-01' = {
  name: staticWebAppName
  location: location
  sku: {
    name: skuName
    tier: skuName
  }
  properties: {
    stagingEnvironmentPolicy: 'Enabled'
    allowConfigFileUpdates: true
    buildProperties: {
      appLocation: '/'
      outputLocation: 'dist'
      skipGithubActionWorkflowGeneration: true
    }
  }
}

@description('The default hostname of the Static Web App.')
output staticWebAppHostname string = staticWebApp.properties.defaultHostname

@description('The resource ID of the Static Web App.')
output staticWebAppId string = staticWebApp.id
