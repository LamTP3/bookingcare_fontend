import axios from "axios";
// import _ from "lodash";
/**
 * MỤC ĐÍCH CỦA FILE NÀY LÀ TẠO RA MỘT CUSTOMIZE CỦA AXIOS ĐỂ KHÔNG PHẢI LẦN  NÀO CŨNG PHẢI GỬI KÈM TOKEN
 * thư viện lodash hỗ trợ việc xử lí array, object, function,...
 */
const instance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
});
instance.interceptors.response.use((response) => {
  const { data } = response;
  return data;
});

export default instance;
