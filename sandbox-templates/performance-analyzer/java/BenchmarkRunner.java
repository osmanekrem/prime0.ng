import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;

public class BenchmarkRunner {
    public static void main(String[] args) {
        int[] testSizes = {100, 1000, 5000};
        StringBuilder jsonResults = new StringBuilder("[");

        for (int i = 0; i < testSizes.length; i++) {
            int size = testSizes[i];
            ArrayList<Integer> testData = generateTestData(size);

            long startOriginal = System.nanoTime();
            OriginalCode.main(new ArrayList<>(testData));
            long endOriginal = System.nanoTime();

            long startImproved = System.nanoTime();
            ImprovedCode.main(new ArrayList<>(testData));
            long endImproved = System.nanoTime();

            double originalMs = (endOriginal - startOriginal) / 1_000_000.0;
            double improvedMs = (endImproved - startImproved) / 1_000_000.0;

            jsonResults.append(String.format(
                "{\\"size\\":%d,\\"original\\":%f,\\"improved\\":%f}",
                size, originalMs, improvedMs
            ));
            if (i < testSizes.length - 1) {
                jsonResults.append(",");
            }
        }
        jsonResults.append("]");
        System.out.println(String.format("{\\"results\\":%s,\\"unit\\":\\"ms\\"}", jsonResults.toString()));
    }

    private static ArrayList<Integer> generateTestData(int size) {
        ArrayList<Integer> list = new ArrayList<>(size);
        Random rand = new Random();
        for (int i = 0; i < size; i++) {
            list.add(rand.nextInt(size));
        }
        return list;
    }
}