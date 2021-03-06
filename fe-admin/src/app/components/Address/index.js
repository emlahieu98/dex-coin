import * as React from 'react';
import { Select } from 'antd';
import request from 'utils/request';
import Input from '../DataEntry/Input';

const { Option } = Select;

export default function Address(props) {
  const [countryOptions, setContryOptions] = React.useState([]);
  const [provinceOptions, setProvinceOptions] = React.useState([]);
  const [districtOptions, setDistrictOptions] = React.useState([]);
  const [wardOptions, setWardOptions] = React.useState([]);

  const requestURL = 'common-service/location-country';

  React.useEffect(() => {
    const getContryOptions = async () => {
      const { data } = await request(requestURL, {})
        .then(response => response)
        .catch(error => error);

      if (data) {
        const contries = data.map(item => {
          return {
            ...item,
            label: item.name,
            value: item.name,
          };
        });

        setContryOptions(contries);
      }
    };

    getContryOptions();
  }, []);

  const handleSelectCountry = async (value, option) => {
    const { data } = await request(
      `${requestURL}?parent_id=${option.id}&type=province`,
      {},
    )
      .then(response => response)
      .catch(error => error);

    if (data) {
      const provinces = data.map(item => {
        return {
          ...item,
          label: item.name,
          value: item.name,
        };
      });

      setProvinceOptions(provinces);

      props.onChange({ country: option.value, country_code: option.code });
    }
  };

  const handleSelectProvince = async (value, option) => {
    const { data } = await request(
      `${requestURL}?parent_id=${option.id}&type=district`,
      {},
    )
      .then(response => response)
      .catch(error => error);

    if (data) {
      const districts = data.map(item => {
        return {
          ...item,
          label: item.name,
          value: item.name,
        };
      });
      setDistrictOptions(districts);

      props.onChange({ province: option.value, province_code: option.id });
    }
  };

  const handleSelectDistrict = async (value, option) => {
    const { data } = await request(
      `${requestURL}?parent_id=${option.id}&type=ward`,
      {},
    )
      .then(response => response)
      .catch(error => error);

    if (data) {
      const wards = data.map(item => {
        return {
          ...item,
          label: item.name,
          value: item.name,
        };
      });
      setWardOptions(wards);

      props.onChange({ district_name: option.value, district_id: option.id });
    }
  };

  const handleSelectWard = async (value, option) => {
    props.onChange({ ward_name: option.value, ward_id: option.id });
  };

  const handleChangeAddress = e => {
    props.onChange({ address1: e.target.value.trim() });
  };

  return (
    <>
      <div className="odii-form-item">
        <div className="odii-form-label">?????a ch???</div>

        <Input
          className="odii-input"
          onChange={handleChangeAddress}
          placeholder="Nh???p ?????a ch???"
        />
      </div>

      <div className="odii-form-item">
        <div className="odii-form-label">Qu???c gia</div>

        <Select
          options={countryOptions}
          placeholder="Ch???n qu???c gia"
          onSelect={handleSelectCountry}
          className="odii-selector"
        >
          {countryOptions.map(country => (
            <Option value={country.code} key={country.code}>
              {country.name}
            </Option>
          ))}
        </Select>
      </div>

      <div className="odii-form-item">
        <div className="odii-form-label">T???nh / Th??nh ph???</div>

        <Select
          options={provinceOptions}
          placeholder="Ch???n t???nh / th??nh ph???"
          onSelect={handleSelectProvince}
          className="odii-selector"
        >
          {provinceOptions.map(province => (
            <Option value={province.code} key={province.id}>
              {province.name}
            </Option>
          ))}
        </Select>
      </div>

      <div className="odii-form-item">
        <div className="odii-form-label">Qu???n / Huy???n</div>

        <Select
          options={districtOptions}
          placeholder="Ch???n qu???n / huy???n"
          onSelect={handleSelectDistrict}
          className="odii-selector"
        >
          {districtOptions.map(district => (
            <Option value={district.code} key={district.id}>
              {district.name}
            </Option>
          ))}
        </Select>
      </div>

      <div className="odii-form-item">
        <div className="odii-form-label">Ph?????ng / X??</div>

        <Select
          options={wardOptions}
          placeholder="Ch???n ph?????ng / x??"
          onSelect={handleSelectWard}
          className="odii-selector"
        >
          {wardOptions.map(ward => (
            <Option value={ward.code} key={ward.id}>
              {ward.name}
            </Option>
          ))}
        </Select>
      </div>
    </>
  );
}
