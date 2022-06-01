import req from './request';

export function getLocation(params) {
  // params.type = country || province || ward || district
  return req('common-service/location-country', { params });
}

export function getStores() {
  // params.type = country || province || ward || district
  return req('product-service/admin/stores', {});
}

export function getSalesChannels(channel = 'lazada') {
  return req(`/sales-channels-service/${channel}/category`, {});
}

export function getAttributes(channel = 'lazada', id) {
  return req(
    `/sales-channels-service/${channel}/category/attributes?cat_id=${id}`,
    {},
  );
}
export function getNotifications() {
  // params.type = country || province || ward || district
  return req('common-service/admin/notifications', {});
}

export function getStoreCategories(params) {
  return req('product-service/find-store-categories', { params });
}

export function getListSuppliers(params = {}) {
  // ?keyword=odi&from_province_id=1&from_district_id=9
  return req('user-service/seller/suggest-suppliers', {
    params,
  });
}
export function getListWarehousing(params = {}) {
  // ?supplier_id=1
  return req('user-service/seller/suggest-warehousing', {
    params,
  });
}
export function getListProvinces(params = {}) {
  // ?supplier_id=1
  return req('common-service/location-country?type=province', {
    params,
  });
}
// const fetchDataProvinces = async () => {
//   const url = 'common-service/location-country?type=province';
//   const response = await req(url, {
//     method: 'get',
//     requireAuth: false,
//   })
//     .then(response => {
//       if (!isEmpty(response?.data)) setProvinces(response?.data);
//     })
//     .catch(error => error);
// };
