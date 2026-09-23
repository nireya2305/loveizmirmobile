export function translateRequestStatus(status: string) {
  switch (status) {
    case "REQUESTED":
      return "Talep Alındı";
    case "PENDING":
      return "Bekleniyor";
    default:
      return status;
  }
}

export function translatePaymentStatus(status: string) {
  switch (status) {
    case "NOT_CONFIGURED":
      return "Ödeme sağlayıcısı yapılandırılmadı";
    default:
      return "Ödeme durumu bilinmiyor";
  }
}

export function translateFulfillmentStatus(status: string) {
  switch (status) {
    case "NOT_STARTED":
      return "Başlamadı";
    default:
      return "Hizmet durumu bilinmiyor";
  }
}

export function translateRequestType(type: string) {
  switch (type) {
    case "SERVICE_REQUEST":
      return "Hizmet";
    case "BOOKING_REQUEST":
      return "Rezervasyon";
    case "PURCHASE_REQUEST":
      return "Satın Alma";
    default:
      return type;
  }
}
