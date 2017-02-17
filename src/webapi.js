/**
 * 获取省市区数据
 */
exports.fetchRegionData = () => {
  return new Promise((resolve, reject) => {
    fetch('https://static.yjsvip.com/static/js/city_data_1.0.js')
      .then((res) => res.json())
      .then((res) => {
        resolve(res);
      })
      .catch(err => reject(err))
      .done();
  });
};
