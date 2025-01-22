import "../css/Culture.css"; // 引入样式文件
import { useNavigate } from 'react-router-dom';
import Header from "./Header.js";
import bg2 from '../culture/culture_bg02.svg';

const Culture = () => {
  const navigate = useNavigate();

  const level_images = [
    'level_2_not.svg',
    'level_3_not.svg',
    'level_6_not.svg',
    'level_1.svg',
    'level_4_not.svg',
    'level_5_not.svg',
  ];

  const level_position = [
    {
      position: 'relative',
      marginTop: '35%',
      marginLeft: '60%',
    }, // 对应 .symbiosis
    {
      position: 'relative',
      marginTop: '-10%',
      marginLeft: '10%',
      scale:'0.9',
    }, // 对应 .show
    {
      position: 'relative',

      marginLeft: '-10%',
      scale:'0.85',
    }, // 对应 .game
    {
      position: 'relative',
      marginTop: '-25%',
      marginLeft: '-20%',
      scale:'0.85',
    }, // 对应 .game
    {
      position: 'relative',
      marginTop: '-15%',
      marginLeft: '5%',
      scale:'0.9',
    }, // 对应 .game
    {
      position: 'relative',
      marginTop: '-30%',
      marginLeft: '15%',
      width:'100%',
    }, // 对应 .game
  ];

  // 设置图片数组样式
  const level_styles = {
    gridContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)', // 一行三列
      gap: '20px', // 设置间距
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      width: '100%', // 父容器寬度 100%
      height: '100%', // 父容器高度 100%
      zIndex: 2,
      marginTop: '70px', // 向下移动
    },
    gridItem: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'visible',
    },
    image: {
      width: '100%',
      height: '100%',
      overflow: 'visible',
      clip: 'auto',
    },
  };

  return (
    <div className="culture">
      {/* Header 组件 */}
      <Header images={['world_btn.svg', 'wall_btn.svg', 'culture_ul_btn.svg']} />
      {/* Content 部分 */}
      <main className="content">
        <div style={level_styles.gridContainer}>
          {level_images.map((image, index) => (
            <div key={index} style={level_styles.gridItem}>
              <img
                src={image}
                alt={`level_image ${index + 1}`}
                style={{
                  ...level_styles.image,
                  ...level_position[index], // 应用每个 item 的位置调整
                  cursor: image === 'level_1.svg' ? 'pointer' : 'default',
                }}

                onClick={() => {
                  if (image === 'level_1.svg'){
                    navigate('/question');// 點擊 level_1.svg 跳轉到 /question
                  }
                }}
              />
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <div className="bg2">
        <img src={bg2} alt="菌種的世界" />
      </div>
    </div>
  );
};

export default Culture;
