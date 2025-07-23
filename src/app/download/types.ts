export type ResourceType =
  | "Whitepaper"
  | "Case Study"
  | "Technical Brief"
  | "Solution Guide"
  | "Datasheet"
  | "Security Advisory"
  | "Implementation Guide"

export type Protocol = "Syslog" | "SFTP" | "SMTP" | "SMB ( SAMBA )" | "Modbus" | "HTTP/S" | "IEC" | "SNMP"

export interface Resource {
  id: string
  title: string
  description: string
  type: ResourceType
  protocol: Protocol
  downloadUrl: string
}