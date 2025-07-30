import { Fragment } from "@/db/schema";

type Props = {
  fragment: Fragment;
};

export default function BenchmarkResult({ fragment }: Props) {
  return (
    <div className="flex flex-col w-full h-full divide-y">
      <div className="grid grid-cols-3">
        <div className="flex w-full items-center p-2.5">Array Size</div>
        <div className="flex w-full items-center p-2.5">Originnal Time (s)</div>
        <div className="flex w-full items-center p-2.5">Improved Time (s)</div>
      </div>
      {JSON.parse(fragment.benchmarkData!).results.map(
        (res: {
          array_size: number;
          original_time: number;
          improved_time: number;
        }) => (
          <div className="grid grid-cols-3">
            <div className="flex w-full items-center p-2.5">
              {res.array_size}
            </div>
            <div className="flex w-full items-center p-2.5">
              {res.original_time}
            </div>
            <div className="flex w-full items-center p-2.5">
              {res.improved_time}
            </div>
          </div>
        )
      )}
    </div>
  );
}
