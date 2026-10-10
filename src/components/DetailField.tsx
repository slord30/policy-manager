interface DetailFieldProps {
  label: string;
  value: string;
}

export default function DetailField({ label, value }: DetailFieldProps) {
  return (
    <div>
      <h3 className="font-medium">{label}</h3>
      <p>{value}</p>
    </div>
  );
}