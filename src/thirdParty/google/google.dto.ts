import { Form, FormField } from '../../crud/form.decorator';
import { FieldTypes, FormTypes } from '../../crud/interfaces/form.interface';
import { GOOGLE_FCM_CONFIG_ENDPOINT } from './googleFcm/interfaces/googleFcm.interface';
import { IGoogleConfigDto } from './interfaces/google.interface';

const wizardSteps = {
  services: {
    title: 'Choose Google Services',
    order: 1,
  },
  authorization: {
    title: 'Authorization',
    order: 2,
  },
  testing: {
    title: 'Test your services',
    order: 3,
  },
};

@Form({ type: FormTypes.Wizard })
export class GoogleConfigDto implements IGoogleConfigDto {
  @FormField({
    label: 'Google Map',
    type: FieldTypes.Checkbox,
    wizardStep: wizardSteps.services,
    isFullWidth: true,
  })
  mapEnabled: boolean;

  @FormField({
    label: 'Google Map API Key',
    type: FieldTypes.Password,
    wizardStep: wizardSteps.services,
    required: true,
    isFullWidth: true,
    optionalsOn: [
      {
        property: 'mapEnabled',
        value: true,
      },
    ],
  })
  mapApiKey: string;

  @FormField({
    label: 'Google Calendar',
    type: FieldTypes.Checkbox,
    wizardStep: wizardSteps.services,
    isFullWidth: true,
  })
  calendarEnabled: boolean;

  @FormField({
    label: 'Client Id',
    type: FieldTypes.Text,
    wizardStep: wizardSteps.services,
    optionalsOn: [
      {
        property: 'calendarEnabled',
        value: true,
      },
    ],
    required: true,
  })
  clientId: string;

  @FormField({
    label: 'Client Secret',
    type: FieldTypes.Password,
    wizardStep: wizardSteps.services,
    optionalsOn: [
      {
        property: 'calendarEnabled',
        value: true,
      },
    ],
    required: true,
  })
  clientSecret: string;

  @FormField({
    label: 'Redirect Uris',
    type: FieldTypes.Text,
    wizardStep: wizardSteps.services,
    optionalsOn: [
      {
        property: 'calendarEnabled',
        value: true,
      },
    ],
    required: true,
    multiple: true,
    isFullWidth: true,
  })
  redirectUris: string[];

  @FormField({
    label: 'Firebase Cloud Messaging',
    type: FieldTypes.Checkbox,
    wizardStep: wizardSteps.services,
    isFullWidth: true,
  })
  fcmEnabled: boolean;

  @FormField({
    label: 'Firebase Realtime DB Url',
    type: FieldTypes.Text,
    wizardStep: wizardSteps.services,
    required: true,
    optionalsOn: [
      {
        property: 'fcmEnabled',
        value: true,
      },
    ],
  })
  fcmDatabaseUrl: string;

  @FormField({
    label: 'Firebase Messaging Id',
    type: FieldTypes.Text,
    wizardStep: wizardSteps.services,
    required: true,
    messages: 'Get value from https://console.firebase.google.com >  Project overview > Choose web client icon',
    optionalsOn: [
      {
        property: 'fcmEnabled',
        value: true,
      },
    ],
  })
  fcmMessagingSenderId: string;

  @FormField({
    label: 'Firebase Messaging Cloud Token',
    type: FieldTypes.Text,
    wizardStep: wizardSteps.services,
    required: true,
    isFullWidth: true,
    optionalsOn: [
      {
        property: 'fcmEnabled',
        value: true,
      },
    ],
  })
  fcmToken: string;

  @FormField({
    label: 'Firebase Admin Secret',
    type: FieldTypes.Textarea,
    wizardStep: wizardSteps.services,
    required: true,
    isFullWidth: true,
    messages: 'Get value from https://console.firebase.google.com > Project settings > Service Accounts',
    optionalsOn: [
      {
        property: 'fcmEnabled',
        value: true,
      },
    ],
  })
  fcmTokenSecret: string;

  @FormField({
    label: 'Project Id',
    type: FieldTypes.Info,
    wizardStep: wizardSteps.authorization,
    messages: 'Visit link above and paste the code into the "Authorization Code" field',
    isFullWidth: true,
    optionalsOn: [
      {
        property: 'calendarEnabled',
        value: true,
      },
    ],
  })
  authorizationLink: string;

  @FormField({
    label: 'Authorization Code',
    type: FieldTypes.Password,
    wizardStep: wizardSteps.authorization,
    required: true,
    optionalsOn: [
      {
        property: 'calendarEnabled',
        value: true,
      },
    ],
  })
  authorizationCode: string;

  @FormField({
    label: 'FCM test send message',
    type: FieldTypes.ButtonCallback,
    actionUrl: GOOGLE_FCM_CONFIG_ENDPOINT + '/test',
    wizardStep: wizardSteps.testing,
    required: true,
    optionalsOn: [
      {
        property: 'fcmEnabled',
        value: true,
      },
    ],
  })
  fcmTest: string;
}
