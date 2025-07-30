import { Fragment } from "@/db/schema";

type Props = {
  fragment: Fragment;
};

export default function BenchmarkResult({ fragment }: Props) {
  return (
    <div className="flex flex-col w-full h-full divide-y">
      <div className="grid grid-cols-3">
        <div className="flex w-full items-center p-2.5">Array Size</div>
        <div className="flex w-full items-center p-2.5">
          Originnal Time (ms)
        </div>
        <div className="flex w-full items-center p-2.5">Improved Time (ms)</div>
      </div>
      {JSON.parse(fragment.benchmarkData!).results.map(
        (res: { size: number; original: number; improved: number }) => (
          <div className="grid grid-cols-3">
            <div className="flex w-full items-center p-2.5">{res.size}</div>
            <div className="flex w-full items-center p-2.5">{res.original}</div>
            <div className="flex w-full items-center p-2.5">{res.improved}</div>
          </div>
        )
      )}
    </div>
  );
}
