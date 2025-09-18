export type ResourceType =
  | "Whitepaper"
  | "Case Study"
  | "Technical Brief"
  | "Solution Guide"
  | "Datasheet"
  | "Security Advisory"
  | "Implementation Guide"

export type Protocol = "All"| "Syslog (TCP/UDP)" | "SFTP" | "SMTP" | "SMB" | "Modbus (TCP/UDP)" | "HTTP/S (PUT/POST)" | "IEC-104" | "SNMP" | "RDP" | "OPC UA" | "VNC"

export interface Resource {
  id: string
  title: string
  description: string
  type: ResourceType
  protocol: Protocol
  downloadUrl: string
}