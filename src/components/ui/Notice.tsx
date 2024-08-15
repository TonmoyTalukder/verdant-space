import { Typography } from 'antd';

const { Text } = Typography;

const Notice = () => {
  return (
    <div style={{backgroundColor: '#cfe8cc', height: '6.5vh', alignContent: 'center'}}>
      <Text strong style={{marginLeft: "2%"}}>🏪 Address: 19/A Dhanmondi, Dhaka, Bangladesh | ☎️ Phone: +880 1700 000000 | 📧 Email: admin@verdant-space.com </Text>
    </div>
  );
};

export default Notice;
