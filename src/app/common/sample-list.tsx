import { GridSampleOrder } from '../grid/config';
import { FormSampleOrder } from '../form-validator/config';

export let samplesList: any = [
    {
        'name': 'Data Grid', 'type':'update', 'category': 'Grids', 'order': '03', 'path': 'grid', 'samples': GridSampleOrder
    },
    {
        'name': 'Form Validation', 'category': 'Forms', 'order': '01', 'path': 'form-validator', 'samples': FormSampleOrder
    },
];
    
