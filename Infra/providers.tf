terraform {
  required_version = "1.5.7"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "3.72.0"
    }
  }
  backend "azurerm" {
    resource_group_name  = "statefiles"
    storage_account_name = "alsdfjweroqokdkdlll"
    container_name       = "statefile"
    key                  = "terraform.tfstate"
  }
}

provider "azurerm" {
  features {}
}
