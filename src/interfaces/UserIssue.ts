interface DeviceDetails {
  brand: string
  model: string
  device_type: string
  os_version: string
}

interface PurchaseInfo {
  purchase_date: string
  warranty_status: string
  purchase_location: string
}

interface ProblemDescription {
  symptoms: string
  error_messages: string
  frequency: string
  trigger: string
  troubleshooting_attempts: string
}

interface CategoryDetails {
  category: string
  subcategory: string
}

export interface UserIssue {
  id: string
  user_id: string
  conversation_id: string
  status: string
  modeOfService: string
  location: string | null
  device_details: DeviceDetails
  purchase_info: PurchaseInfo
  problem_description: ProblemDescription
  category_details: CategoryDetails
  summary: string
  created_at: string
  updated_at: string
}
