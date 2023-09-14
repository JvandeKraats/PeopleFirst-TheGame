resource "azurerm_resource_group" "rg" {
  name     = "rg-PeopleFirst-Test"
  location = "westeurope"
}

resource "azurerm_service_plan" "sp" {
  name                = "PeopleFirst-Plan"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  os_type             = "Linux"
  sku_name            = "B1"
}

resource "azurerm_linux_web_app" "lwa" {
  name                = "PeopleFirst-WebApp"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_service_plan.sp.location
  service_plan_id     = azurerm_service_plan.sp.id

  site_config {
    application_stack {
      node_version = "18-lts"
    }
  }
}
