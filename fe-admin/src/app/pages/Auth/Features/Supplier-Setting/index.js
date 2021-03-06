import * as React from 'react';
import { Input } from 'antd';
import Address from 'app/components/Address';
import request from 'utils/request';
import { useLocation } from 'react-router-dom';

export default function SupplierSetting() {
  const [supplier, setSupplier] = React.useState({});
  const [categories, setCategories] = React.useState([]);

  React.useEffect(() => {
    const getCategories = async () => {
      const { data } = await request(
        'product-service/categories-listing?page=1&is_top=true',
        {},
      )
        .then(response => response)
        .catch(error => error);

      if (data) {
        setCategories(data);
      }
    };

    getCategories();
  }, []);

  const handleChangeName = e => {
    setSupplier({
      ...supplier,
      name: e.target.value.trim(),
    });
  };

  const handleChangeEmail = e => {
    setSupplier({
      ...supplier,
      contact_email: e.target.value.trim(),
    });
  };

  const handleChangePhone = e => {
    setSupplier({
      ...supplier,
      location: {
        phone_number: e.target.value.trim(),
      },
    });
  };

  const handleChangeAddress = async value => {
    setSupplier({
      ...supplier,
      location: {
        ...value,
      },
    });
  };

  const handleChangeCategory = value => {
    const category_ids = supplier.category_ids || [];

    let newCategoryIds = category_ids;

    if (category_ids.find(id => id === value)) {
      newCategoryIds = category_ids.filter(id => id !== value);
    } else {
      newCategoryIds.push(value);
    }
  };

  const handleSubmitSupplier = async () => {
    const response = await request('/user-service/seller/register-supplier', {
      method: 'post',
      data: supplier,
    })
      .then(response => response)
      .catch(error => error);

    if (response.data.is_success) {
      window.location.href = '/auth/completed';
    } else {
      console.log(response.data.message || response.data.error_code);
    }
  };

  return (
    <div className="supplier_setting">
      <div className="supplier_setting__section">
        <div className="supplier_setting__section_left">
          <div className="supplier_setting__title">Th??ng tin li??n h???</div>
          <div className="supplier_setting__desc">
            Nh???p c??c th??ng tin c?? b???n c???a c??ng ty ????? Odii h??? tr??? b???n t???t h??n.
          </div>
        </div>

        <div className="supplier_setting__section_right">
          <div className="odii-form">
            <div className="odii-form-dual">
              <div className="odii-form-dual-item">
                <div className="odii-form-item">
                  <div className="odii-form-label">T??n c??ng ty</div>
                  <div className="odii-form-input">
                    <Input
                      placeholder="T??n c???a h??ng / doanh nghi???p"
                      onChange={handleChangeName}
                      className="odii-input"
                    />
                  </div>
                </div>

                <div className="odii-form-item">
                  <div className="odii-form-label">Email li??n h???</div>
                  <div className="odii-form-input">
                    <Input
                      placeholder="Email li??n h???"
                      onChange={handleChangeEmail}
                      className="odii-input"
                    />
                  </div>
                </div>

                <div className="odii-form-item">
                  <div className="odii-form-label">S??? ??i???n tho???i</div>
                  <div className="odii-form-input">
                    <Input
                      placeholder="S??? ??i???n tho???i"
                      onChange={handleChangePhone}
                      className="odii-input"
                    />
                  </div>
                </div>

                <div className="odii-form-item">
                  <div className="odii-form-label">Website</div>
                  <div className="odii-form-input">
                    <Input
                      placeholder="https://example.com"
                      //   onChange={handleChangeWebsite}
                      className="odii-input"
                    />
                  </div>
                </div>

                <div className="odii-form-item">
                  <div className="odii-form-label">Facebook</div>
                  <div className="odii-form-input">
                    <Input
                      placeholder="https://facebook.com/odii.platform"
                      //   onChange={handleChangeFacebook}
                      className="odii-input"
                    />
                  </div>
                </div>
              </div>

              <div className="odii-form-dual-item">
                <Address onChange={handleChangeAddress} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="supplier_setting__section">
        <div className="supplier_setting__section_left">
          <div className="supplier_setting__title">Ng??nh h??ng cung c???p</div>
          <div className="supplier_setting__desc">
            Doanh nghi???p c???a b???n chuy??n cung c???p s???n ph???m thu???c ng??nh h??ng n??o?
          </div>
        </div>

        <div className="supplier_setting__section_right">
          <div className="odii-form">
            <div className="odii-form-item">
              <div className="odii-form-label">
                L???a ch???n ng??nh h??ng cung c???p
              </div>

              <div className="odii-form-input">
                <div className="supplier_setting__categories">
                  {categories &&
                    categories.map(category => (
                      <CategoryItem
                        category={category}
                        onChange={handleChangeCategory}
                      />
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="supplier_setting__button">
        <button className="auth__form-button" onClick={handleSubmitSupplier}>
          X??c nh???n
        </button>
      </div>
    </div>
  );
}

const CategoryItem = props => {
  const [isActive, setIsActive] = React.useState(false);

  const handleChangeCategory = async category => {
    setIsActive(!isActive);
    props.onChange(category.id);
  };

  return (
    <div
      className={`supplier_setting__category ${isActive ? 'active' : ''}`}
      key={props.category.id}
      onClick={_ => handleChangeCategory(props.category)}
    >
      <div className="supplier_setting__category_img">
        <img src={props.category.thumb?.origin} alt="" />
      </div>

      <div className="supplier_setting__category_name">
        {props.category.name}
      </div>
    </div>
  );
};
