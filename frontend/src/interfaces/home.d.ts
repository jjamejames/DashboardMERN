export interface PieChartProps{
    title: string,
    value: number,
    series: number[],
    colors: string[]
}

export interface FormProps {
  type: string;
  register: any;
  onFinish: (
    values: FieldValues
  ) => Promise<void | CreateResponse | UpdateResponse>;
  formLoading: boolean;
  handleSubmit: FormEventHandler<HTMLFormElement> | undefined;
  handleImageChange: (file: any) => void;
  onFinishHandler: (values: FieldValues) => Promise<void>;
  propertyImages: { name: string; url: string };
}