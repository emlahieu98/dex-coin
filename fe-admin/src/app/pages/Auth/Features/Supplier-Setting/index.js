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
          <div className="supplier_setting__title">Thông tin liên hệ</div>
          <div className="supplier_setting__desc">
            Nhập các thông tin cơ bản của công ty để Odii hỗ trợ bạn tốt hơn.
          </div>
        </div>

        <div className="supplier_setting__section_right">
          <div className="odii-form">
            <div className="odii-form-dual">
              <div className="odii-form-dual-item">
                <div className="odii-form-item">
                  <div className="odii-form-label">Tên công ty</div>
                  <div className="odii-form-input">
                    <Input
                      placeholder="Tên cửa hàng / doanh nghiệp"
                      onChange={handleChangeName}
                      className="odii-input"
                    />
                  </div>
                </div>

                <div className="odii-form-item">
                  <div className="odii-form-label">Email liên hệ</div>
                  <div className="odii-form-input">
                    <Input
                      placeholder="Email liên hệ"
                      onChange={handleChangeEmail}
                      className="odii-input"
                    />
                  </div>
                </div>

                <div className="odii-form-item">
                  <div className="odii-form-label">Số điện thoại</div>
                  <div className="odii-form-input">
                    <Input
                      placeholder="Số điện thoại"
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
          <div className="supplier_setting__title">Ngành hàng cung cấp</div>
          <div className="supplier_setting__desc">
            Doanh nghiệp của bạn chuyên cung cấp sản phẩm thuộc ngành hàng nào?
          </div>
        </div>

        <div className="supplier_setting__section_right">
          <div className="odii-form">
            <div className="odii-form-item">
              <div className="odii-form-label">
                Lựa chọn ngành hàng cung cấp
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
          Xác nhận
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
