import { config } from '@/config';
import { fetchFile } from '@/http';
import { IFieldData, IFormFieldUpload } from '@/interfaces/form.interface';
import { DropzoneOptions } from 'dropzone';
import _ from 'lodash';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import 'vue2-dropzone/dist/vue2Dropzone.min.css';
import IField from './interfaces/ITextField';
import TextField from './TextField';

@Component({ name: 'UploadField' })
export default class UploadField extends TextField implements IField {
  @Prop({
    type: String,
    required: true,
  })
  resourceId: string;

  @Prop({
    type: Object,
    required: true,
  })
  field: IFormFieldUpload;

  @Prop({
    type: Boolean,
  })
  isEdit: boolean;

  @Prop({
    type: Object,
    required: false,
  })
  formData: { [key: string]: any };

  value: IFieldData;

  localFileUrl: string = '';

  tempModel: string | null = null;

  get resource() {
    return this.$route.params.resource;
  }

  get getLocalFileUrl() {
    return this.localFileUrl;
  }

  get getRemoteFileUrl() {
    return `https://drive.google.com/viewerng/viewer?embedded=true&url=${
      config.api
    }fileStorage/openFile/${this.model.id}\
    &token=${localStorage.getItem('token') || '"Bearer public"'}`;
  }

  get model(): IFieldData {
    return this.value;
  }

  set model(val: IFieldData) {
    this.$emit('input', val);
  }

  onUploading(file: any, xhr: any, uploadFormData: any) {
    // resolve owner id
    let ownerId = '';

    if (this.field.ownerId) {
      ownerId = _.get(this.formData, this.field.ownerId);
    }

    uploadFormData.append('id', ownerId || this.resourceId);
    uploadFormData.append('ownerId', ownerId || this.resourceId);
  }

  async onUploadSuccess(file: any, response: any) {
    this.model = response;
    this.localFileUrl = await fetchFile(response.id);
  }

  getFileMeta(file: any) {
    try {
      const meta = file.file ? file.file : JSON.parse(file.meta);
      const mimetypes = meta.mimetype.split('/');

      meta.type = ['png', 'jpg', 'jpeg', 'gif'].includes(
        mimetypes[mimetypes.length - 1],
      )
        ? 'image'
        : 'file';

      return meta;
    } catch (e) {
      console.error('Invalid file structure');
      return {};
    }
  }

  getDropzoneOptions(field: IFormFieldUpload): DropzoneOptions {
    const uploadUrl = field.uploadUrl
      ? `${config.api}${field.uploadUrl}`
      : `${config.ajaxUploadUrl}/${this.resource}/upload`;

    const options: DropzoneOptions = {
      url: `${uploadUrl}`,
      headers: {
        authorization: JSON.parse(localStorage.getItem('token') || '""'),
        realm: 'master',
      },
      maxFilesize: field.maxFileSize || 100,
      acceptedFiles:
        field.type === 'image'
          ? 'image/*'
          : field.type === 'csv'
          ? '.csv'
          : 'image/*, application/pdf, .doc, .docs, .xls, .xlsx',
      maxFiles: field.multiple ? field.maxFiles || 10 : 1,
      parallelUploads: 10,
      addRemoveLinks: true,
      thumbnailWidth: 150,
      thumbnailHeight: 150,
    };

    return options;
  }

  async populateFile() {
    if (this.model) {
      this.localFileUrl = await fetchFile(this.model.id);

      const dropzone: any = this.$refs.dropzone;

      if (dropzone) {
        dropzone.manuallyAddFile({}, this.localFileUrl);
      }
    }
  }

  created() {
    this.populateFile();
  }
}
