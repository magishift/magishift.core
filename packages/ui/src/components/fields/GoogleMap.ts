import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { Watch } from 'vue-property-decorator';
import { gmapApi } from 'vue2-google-maps';

export interface IGeoLocation {
  text: string;
  titleAddress: string;
  address: string;
  lat: number;
  lng: number;
}

const jakartaLocation = {
  lat: -6.121435,
  lng: 106.774124,
};

@Component({ name: 'GoogleMap' })
export default class GoogleMap extends Vue {
  @Prop({
    type: Object,
    default: () => {
      return jakartaLocation;
    },
  })
  value: IGeoLocation;

  @Prop({
    type: String,
  })
  name: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  readonly: boolean = false;

  @Prop({
    type: Boolean,
    default: false,
  })
  required: boolean = false;

  get google(): any {
    return gmapApi;
  }

  get model(): IGeoLocation {
    return this.value;
  }

  set model(val: IGeoLocation) {
    this.$emit('input', val);
  }

  geocoder = new this.google.maps.Geocoder();

  center = {
    lat: this.value ? this.value.lat : jakartaLocation.lat,
    lng: this.value ? this.value.lng : jakartaLocation.lng,
  };

  markers = [
    {
      position: {
        lat: this.value ? this.value.lat : jakartaLocation.lat,
        lng: this.value ? this.value.lng : jakartaLocation.lng,
      },
    },
  ];

  @Watch('value', { deep: true })
  onValue(val: IGeoLocation) {
    if (val) {
      this.center = {
        lat: val.lat || jakartaLocation.lat,
        lng: val.lng || jakartaLocation.lng,
      };
      this.markers = [
        {
          position: {
            lat: val.lat || jakartaLocation.lat,
            lng: val.lng || jakartaLocation.lng,
          },
        },
      ];
    }
  }

  async onMarkerDragEnd({
    latLng,
  }: {
    latLng: { lat: () => number; lng: () => number };
  }) {
    if (latLng) {
      const location = {
        lat: latLng.lat(),
        lng: latLng.lng(),
      };

      this.geocoder.geocode(
        {
          location,
        },
        (results: any[], status: string) => {
          if (status === 'OK') {
            const place = results[0];

            this.model = {
              text: place.formatted_address,
              titleAddress: place.address_components[0].long_name,
              address: place.formatted_address,
              lat: location.lat,
              lng: location.lng,
            };
          }
        },
      );
    }
  }

  async onAutocompleteChange(place: any) {
    if (place) {
      const location = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };

      this.model = {
        titleAddress: place.name,
        address: place.formatted_address,
        text: `${place.formatted_address}`,
        lat: location.lat,
        lng: location.lng,
      };

      this.markers = [{ position: location }];

      this.center = location;
    }
  }
}
