package com.advantage.order.store.model;

import java.util.EmptyStackException;


/**
 * See feature 1779 - Order History (Web Only)
 * @author Binyamin Regev on on 27/07/2016.
 */
public class Feature1779OrdersHistory {

    private static final int KB = 1024; //  1KB

    /**
     * Very simple implementation of <i>Stack</i> to generate a memory leak.
     */
    private class Feature1779Stack {
        private Object[] elements;
        private int size = 0;

        /**
         * Default Constructor: Create the stack with space for 1024 elements.
         */
        public Feature1779Stack() {
            elements = new Object[KB];
        }

        /**
         * Create the stack with space for {@code initialCapacity} elements.
         * @param initialCapacity
         */
        public Feature1779Stack(int initialCapacity) {
            elements = new Object[initialCapacity];
        }

        /**
         * Add an an element into the <i>Stack</i>.
         * @param object and {@link Object} instance to add to the stack.
         */
        public void push(Object object) {
            ensureCapacity();
            elements[size++] = object;
        }

        /**
         * Remove an element from the <i>Stack</i>.
         * @return {@link Object}.
         */
        public Object pop() {
            if (size == 0) throw new EmptyStackException();
            return elements[--size];
        }

        private void ensureCapacity() {
            if (elements.length == size) {
                Object[] oldElements = elements;
                elements = new Object[2 * elements.length + 1];
                System.arraycopy(oldElements, 0, elements, 0, size);
            }
        }

    }

    /**
     * This is the element used to create 1KB of memory leak.
     */
    private class Feature1779Element {
        private char[] chars = new char[KB];
    }

    //  Counter if we use finalize() method
    private static int finalizeCount = 0;
    //int[] val = new int[KB];  //  1K

    /**
     * Default constructor: Generate 1MB of memory leak.
     */
    public Feature1779OrdersHistory() {
        Feature1779Stack stack = new Feature1779Stack((KB*KB));
    }

    /**
     * Constructor: Generate the request of memory leak in KB.
     */
    public Feature1779OrdersHistory(int initialCapacity) {
        Feature1779Stack stack = new Feature1779Stack(initialCapacity);
    }

    public void finalize()
    {
        try {
            super.finalize();
            finalizeCount++;
        } catch (Throwable throwable) {
            throwable.printStackTrace();
        }
    }

    /**
     * Actually generated the memory leak by pushing and popping in and from the stack.
     * @param howMuchToGenerate
     */
    public void generateMemoryLeak(int howMuchToGenerate) {
        try
        {
            Feature1779Stack s = new Feature1779Stack(howMuchToGenerate);

            //  Each push and pop should generate 1KB of leaked memory
            for (int i = 0; i < howMuchToGenerate; i++) {
                s.push(new Feature1779Element());
            }

            for (int i = 0; i < howMuchToGenerate; i++) {
                s.pop();
            }

            System.out.println("Pushed and poped " + howMuchToGenerate + " objects");

        } catch(Throwable t) {
            System.out.println(t);
        }

    }
    /**
     * An example to run {@link Feature1779OrdersHistory} which creates a <i>Memory Leak</i>.
     * @param args
     */
    public static void main(String[] args) {
        Runtime runtime = Runtime.getRuntime();
        System.out.println("Total memory: " + runtime.totalMemory() + ", " +
                "free memory: " + runtime.freeMemory());

        for (int i = 0; i < 1000; i++) {
            new Feature1779OrdersHistory();
        }
        System.out.println("Number of times finalize executed: " + Feature1779OrdersHistory.finalizeCount);
        System.out.println("Total memory: " + runtime.totalMemory() + ", " +
                "free memory: " + runtime.freeMemory());

        //for (int i = 0; i < 1000; i++) { new Feature1779OrdersHistory(); }
        //System.out.println("Number of times finalize executed: " +
        //        Feature1779OrdersHistory.finalizeCount);
    }
}
