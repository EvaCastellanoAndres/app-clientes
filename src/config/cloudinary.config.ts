import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

cloudinary.config({
  cloud_name: 'dmhemvly5',
  api_key: '265739886399886',
  api_secret: '7ldmOLdeE5gjJgUSkq5rtINPeCY',
});

export default cloudinary;
