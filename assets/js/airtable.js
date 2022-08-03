import Airtable from 'airtable';

Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: import.meta.env.VITE_AIRTABLE_API_KEY
});

const base = Airtable.base(import.meta.env.VITE_AIRTABLE_BASE_ID);

export const getItems = () => {
    base('Projects').select({
        view: 'Grid view'
    }).firstPage(function(err, records) {
        if (err) { 
            console.error(err); return; 
        }
        records.forEach(function(record) {
            console.log(record.get('Name'));
        });
    });
};
