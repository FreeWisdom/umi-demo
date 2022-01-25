import {
  Tooltip,
  PageHeader,
  Input,
  Select,
  Card,
  DatePicker,
  Space,
  Button,
  Table,
  Tag,
  Progress,
  message,
} from 'antd';
import { UserOutlined, KeyOutlined } from '@ant-design/icons';
import { history } from 'umi';
import { useState, useEffect } from 'react';
// import { debounce } from '@/utils/utils';
import { connect } from 'dva';
import styles from './index.less';

const Login = (props) => {
  const { dispatch } = props;
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const handleCilckLogin = (e) => {
    window.localStorage.clear();
    window.sessionStorage.clear();

    if (username !== '' && password !== '') {
      dispatch({
        type: 'loginModel/userLogin',
        payload: {
          username,
          password,
        },
      }).then((res) => {
        if (res) {
          window.localStorage.setItem('Authorization', res.token);
          window.localStorage.setItem('menuList', JSON.stringify(res.menuList));
          window.localStorage.setItem('roleList', JSON.stringify(res.roleList));
          window.localStorage.setItem('name', res.name);
          window.localStorage.setItem('userId', res.userId);
          history.push('/planShow/dayList');
        } else {
          message.error('用户不存在！');
        }
      });
    } else {
      message.error('请输入用户名和密码！');
    }
  };

  const handleUserNameChange = (e) => {
    setUserName(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        {/* <div className={styles.umaxPicture}></div> */}
        <div className={styles.umaxText}></div>
        {/* <div className={styles.umaxTextEnglish}>
          UMAX Air Traffic Controler Scheduling System
        </div> */}
        <div className={styles.umaxTextEnglish}>
          Air Traffic Controler Scheduling System
        </div>
        <Space direction="vertical" style={{ width: '400px' }}>
          <div>用户名</div>
          <Input
            size="large"
            placeholder="请输入用户名！"
            style={{ marginBottom: '5%' }}
            className={username ? styles.input : styles.input_red}
            defaultValue={username}
            // onChange={debounce(handleUserNameChange, 300)}
          />
          <div>密码</div>
          <Input.Password
            size="large"
            className={password ? styles.input : styles.input_red}
            placeholder="请输入密码！"
            prefix={<KeyOutlined />}
            defaultValue={password}
            // onChange={debounce(handlePasswordChange, 300)}
          />
          <a style={{ float: 'right', marginBottom: '8%' }}>忘记密码？</a>
          <Button
            size="large"
            style={{
              width: '100%',
              backgroundColor: '#495281',
              color: '#ffffff',
              fontSize: '14px',
              fontFamily: 'Helvetica',
            }}
            onClick={handleCilckLogin}
          >
            登录
          </Button>
        </Space>
      </div>
    </div>
  );
};

const mapStateToProps = ({ loginModel }) => {
  return { ...loginModel };
};

export default connect(mapStateToProps)(Login);
