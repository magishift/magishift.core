import * as csvtojsonV2 from 'csvtojson/v2';

export const csvtojson = async (fileBuffer: Buffer): Promise<any[]> => {
  return new Promise<object[]>((resolve, reject) => {
    csvtojsonV2({
      delimiter: ';',
    })
      .fromString(fileBuffer.toString('utf8'))
      .on('error', error => {
        reject(error);
      })
      .then((result: object[]) => {
        if (result) {
          resolve(result);
        } else {
          reject('Error converting CSV to JSON. CSV empty or invalid format');
        }
      });
  });
};
