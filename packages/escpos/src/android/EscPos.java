package co.ablabs.cordova.plugin.escpos;

import com.epson.eposprint.Builder;
import com.epson.eposprint.EposException;
import com.epson.eposprint.Print;
import com.epson.epsonio.DevType;
import com.epson.epsonio.DeviceInfo;
import com.epson.epsonio.EpsonIo;
import com.epson.epsonio.EpsonIoException;
import com.epson.epsonio.FilterOption;
import com.epson.epsonio.Finder;
import com.epson.epsonio.IoStatus;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.LOG;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.lang.StringBuilder;

public class EscPos extends CordovaPlugin {
    String selectedPrinterName = "TM-T20II";
    int selectedPrinterType = Print.DEVTYPE_USB;
    String selectedPrinterAddress = "/dev/bus/usb/003/002";
    int selectedLineLength = EscPos.LINE_LENGTH_MEDIUM;

    public static int LINE_LENGTH_NARROW = 48;
    public static int LINE_LENGTH_MEDIUM = 42;
    public static int LINE_LENGTH_WIDE = 48;

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);

        try {
            LOG.i("ESCPOS", "Searching for connected USB printers!");
            this.searchAndSelectPrinters();
        } catch (EpsonIoException e) {
            LOG.e("ESCPOS", "Error selecting printer!");
        }
    }

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        boolean executeCommandSuccess = false;

        if(action != null && !action.isEmpty()) {

            //Printer selection
            JSONObject printerInfoData = args.optJSONObject(1);
            if(printerInfoData != null) {
                String printerName = printerInfoData.getString("printer-name");
                String printerTypeName = printerInfoData.getString("printer-type");
                String printerAddress = printerInfoData.getString("printer-address");

                Integer printerType = Print.DEVTYPE_USB;
                if(printerTypeName != null) {
                    if(printerTypeName.equalsIgnoreCase("ethernet")) {
                        printerType = Print.DEVTYPE_TCP;
                    } else if(printerTypeName.equalsIgnoreCase("bluetooth")) {
                        printerType = Print.DEVTYPE_BLUETOOTH;
                    }
                }

                this.selectPrinter(printerName, printerAddress, printerType);
            }

            try {
                if (action.equals("printSample")) {
                    executeCommandSuccess = this.printSample();

                    executeMessageCallback(callbackContext, executeCommandSuccess);
                } else if (action.equals("printerCommand")) {
                    JSONObject commandData = args.optJSONObject(0);

                    if (commandData != null) {
                        executeCommandSuccess = this.printerCommand(commandData);
                    }

                    executeMessageCallback(callbackContext, executeCommandSuccess);
                } else if (action.equals("printText")) {
                    String printData = args.getString(0);

                    if (printData != null) {
                        executeCommandSuccess = this.printText(printData);
                    }

                    executeMessageCallback(callbackContext, executeCommandSuccess);
                } else if (action.equals("sendEscPosCommands")) {
                    String escPosCommands = args.getString(0);

                    executeCommandSuccess = this.sendEscPosCommands(escPosCommands);

                    executeMessageCallback(callbackContext, executeCommandSuccess);
                } else if (action.equals("searchPrinters")) {
                    JSONArray printers = this.searchAndSelectPrinters();

                    callbackContext.success(printers);
                } else if (action.equals("selectPrinter")) {
                    printerInfoData = args.optJSONObject(0);
                    if(printerInfoData != null) {
                        String printerName = printerInfoData.getString("printer-name");
                        Integer printerType = printerInfoData.getInt("printer-type");
                        String printerAddress = printerInfoData.getString("printer-address");

                        executeCommandSuccess = this.selectPrinter(printerName, printerAddress, printerType);
                    }

                    executeMessageCallback(callbackContext, executeCommandSuccess);
                } else if (action.equals("printLines")) {
                    Object printLinesObject = args.get(0);

                    if(printLinesObject != null) {
                        executeCommandSuccess = this.printLines(printLinesObject);
                    }
                }

            } catch (EposException e) {
                callbackContext.error("EXCEPTION - " + e.getMessage());
                e.printStackTrace();
            } catch (EpsonIoException e) {
                callbackContext.error("IO EXCEPTION - " + e.getMessage());
                e.printStackTrace();
            }
        }

        return executeCommandSuccess;
    }

    private void executeMessageCallback(CallbackContext callbackContext, boolean executeCommandSuccess) {
        if (executeCommandSuccess) {
            callbackContext.success("Printer Command - SUCCESS!");
        } else {
            callbackContext.error("Printer Command - FAILURE!");
        }
    }

    public boolean printSample() throws EposException {
        boolean success = true;

        Print printer = new Print(cordova.getActivity().getApplicationContext());

        int errStatus = 0;
        int[] status = new int[1];
        int[] battery = new int[1];
        status[0] = 0;
        battery[0] = 0;

        try {
            //Initialize a Builder class instance
            Builder builder = new Builder(selectedPrinterName, Builder.MODEL_ANK);
            //Create a print document
            //<Configure the print character settings>
            builder.addTextLang(Builder.LANG_EN);
            builder.addTextSmooth(Builder.TRUE);
            builder.addTextFont(Builder.FONT_A);
            builder.addTextSize(4, 4);
            builder.addTextStyle(
                    Builder.FALSE,
                    Builder.FALSE,
                    Builder.TRUE,
                    Builder.PARAM_UNSPECIFIED);
            //<Specify the print data>
            builder.addText("Hello,\t");
            builder.addText("World from Maestro!\n");
            builder.addCut(Builder.CUT_FEED);

            printer.openPrinter(selectedPrinterType, selectedPrinterAddress, Print.TRUE,
                    Print.PARAM_DEFAULT);
            printer.sendData(builder, 10000, status, battery);
            //printer.closePrinter();

        } catch (EposException e) {
            e.printStackTrace();

            //Acquire the error status
            errStatus = e.getErrorStatus();

            //Acquire the printer status
            status[0] = e.getPrinterStatus();

            //Acquire the battery status
            battery[0] = e.getBatteryStatus();

            LOG.e("PRINT", "ErrStatus: " + errStatus + "; Status: " + status[0] + "; Battery: " + battery[0], e);

            success = false;
        } finally {
            printer.closePrinter();
        }

        return success;
    }

    private boolean printLines(Object printLinesObject) throws EposException {
        boolean success = true;

        Print printer = new Print(cordova.getActivity().getApplicationContext());

        int errStatus = 0;
        int[] status = new int[1];
        int[] battery = new int[1];
        status[0] = 0;
        battery[0] = 0;

        try {
            //Initialize a Builder class instance
            Builder builder = new Builder(selectedPrinterName, Builder.MODEL_ANK);

            builder.addTextLang(Builder.LANG_EN);
            builder.addTextSmooth(Builder.TRUE);
            builder.addTextFont(Builder.FONT_A);
            builder.addTextSize(1, 1);
            builder.addTextAlign(Builder.ALIGN_LEFT);

            try {
                String title = "";
                JSONArray printLinesArray = null;
                JSONObject printLinesJson = null;

                //determine
                if(printLinesObject instanceof String) {
                    builder.addText((String) printLinesObject);
                } else if(printLinesObject instanceof JSONObject) {
                    printLinesJson = (JSONObject) printLinesObject;

                    if(printLinesJson.has("title")) {
                        title = printLinesJson.getString("title");
                    }

                    if(printLinesJson.has("printLines")) {
                        printLinesArray = printLinesJson.getJSONArray("printLines");
                    }
                } else if(printLinesObject instanceof JSONArray) {
                    printLinesArray = (JSONArray) printLinesObject;
                }

                //print title
                if(title != null && !title.isEmpty()) {
                    builder.addTextDouble(Builder.TRUE, Builder.TRUE);
                    builder.addText(title + "\n");
                    builder.addTextDouble(Builder.FALSE, Builder.FALSE);
                    builder.addText(paddedLine("-") + "\n\n");
                }

                //
                if(printLinesArray != null && printLinesArray.length() > 0) {
                    for(int currentIndex = 0; currentIndex < printLinesArray.length(); currentIndex++) {
                        Object currentLine = printLinesArray.get(currentIndex);

                        if(currentLine != null) {
                            if(currentLine instanceof String) {
                                String currentLineString = (String) currentLine;
                                builder.addText(currentLineString + "\n");
                            } else if(currentLine instanceof JSONObject) {
                                JSONObject currentLineObject = (JSONObject) currentLine;
                                boolean isBold = currentLineObject.has("isBold") ? currentLineObject.getBoolean("isBold") : false;
                                String textLine = currentLineObject.has("text") ? currentLineObject.getString("text") : null;
                                String textLeft = currentLineObject.has("left") ? currentLineObject.getString("left") : null;
                                String textRight = currentLineObject.has("right") ? currentLineObject.getString("right") : null;

                                if(textLine == null) {
                                    textLeft = (textLeft != null) ? textLeft : "";
                                    textRight = (textRight != null) ? textRight : "";

                                    textLine = spacesBetween(textLeft, textRight, " ");
                                }

                                //is bold text
                                builder.addTextStyle(Builder.PARAM_UNSPECIFIED,
                                        Builder.PARAM_UNSPECIFIED,
                                        isBold ? Builder.TRUE : Builder.FALSE,
                                        Builder.PARAM_UNSPECIFIED);

                                //add text line to print
                                builder.addText(textLine + "\n");
                            }
                        }
                    }

                }

                // Add command to cut receipt to command buffer
                builder.addCut(Builder.CUT_FEED);

            } catch (JSONException e) {
                success = false;
                e.printStackTrace();
                LOG.e("ESCPOS", "Data Error: " + e.getMessage(), e);
            }

            printer.openPrinter(selectedPrinterType, selectedPrinterAddress, Print.TRUE,
                    Print.PARAM_DEFAULT);
            printer.sendData(builder, 10000, status, battery);

        } catch(EposException e) {
            e.printStackTrace();

            //Acquire the error status
            errStatus = e.getErrorStatus();

            //Acquire the printer status
            status[0] = e.getPrinterStatus();

            //Acquire the battery status
            battery[0] = e.getBatteryStatus();

            LOG.e("ESCPOS", "ErrStatus: " + errStatus + "; Status: " + status[0] + "; Battery: " + battery[0], e);

            success = false;
        } finally {
            printer.closePrinter();
        }

        return success;
    }

    public boolean printerCommand(JSONObject commandData) throws EposException, JSONException {
        boolean success = true;

        JSONObject printData = commandData.has("print") ? commandData.getJSONObject("print") : null;
        Boolean cashDrawCommand = commandData.has("drawer") ? commandData.getBoolean("drawer") : false;

        Print printer = new Print(cordova.getActivity().getApplicationContext());

        int errStatus = 0;
        int[] status = new int[1];
        int[] battery = new int[1];
        status[0] = 0;
        battery[0] = 0;

        if(printData == null && (cashDrawCommand == null || !cashDrawCommand)) {
            success = false;
        } else {

            try {
                //Initialize a Builder class instance
                Builder builder = new Builder(selectedPrinterName, Builder.MODEL_ANK);

                if(printData != null) {
                    // Text buffer
                    StringBuilder textData = new StringBuilder();

                    // addBarcode API settings
                    final int barcodeWidth = 2;
                    final int barcodeHeight = 100;

                    try {
                        String title = printData.getString("title");
                        String orderNumber = printData.getString("orderNumber");
                        String invoiceDate = printData.getString("invoiceDate");
                        String subtotal = printData.getString("subtotal");
                        String tax = printData.getString("tax");
                        String total = printData.getString("total");
                        String barcode = printData.getString("barcode");
                        JSONArray itemsList = printData.getJSONArray("items");
                        String receiptMessage = printData.getString("message");
                        String addressLine1 = printData.has("addressLine1") ? printData.getString("addressLine1") : "";
                        String addressLine2 = printData.has("addressLine2") ? printData.getString("addressLine2") : "";
                        String gstHstNumber = printData.has("gstHstNumber") ? printData.getString("gstHstNumber") : null;

                        builder.addTextSize(1, 1);
                        builder.addTextAlign(Builder.ALIGN_CENTER);

                        builder.addTextDouble(Builder.TRUE, Builder.TRUE);
                        builder.addText(title + "\n");

                        builder.addTextDouble(Builder.FALSE, Builder.FALSE);

                        builder.addText(addressLine1 + "\n");
                        builder.addText(addressLine2 + "\n");

                        if(gstHstNumber != null && !gstHstNumber.isEmpty()) {
                            builder.addText("\n" + spacesBetween("GST/HST", gstHstNumber, " ") + "\n");
                        }

                        builder.addText(paddedLine("-") + "\n\n");
                        builder.addText(spacesBetween("ORDER DATE", invoiceDate, " ") + "\n");
                        builder.addText(spacesBetween("ORDER NUMBER", orderNumber, " ") + "\n");

                        builder.addText(paddedLine("-") + "\n");
                        builder.addFeedLine(2);

                        for(int i = 0; i < itemsList.length(); i++) {
                            JSONObject item = itemsList.getJSONObject(i);

                            String quantity = item.getString("quantity");
                            String name = item.getString("name");
                            String price = item.getString("price");

                            textData.append(spacesBetween(quantity + " " + name, price, " ") + "\n");

                            if(item.has("addons")) {
                                JSONArray addonsList = item.getJSONArray("addons");

                                for (int j = 0; j < addonsList.length(); j++) {
                                    JSONObject addon = addonsList.getJSONObject(j);

                                    String addonName = addon.getString("name");
                                    String addonPrice = addon.getString("price");

                                    textData.append(spacesBetween("    + " + addonName, addonPrice + "  ", " ") + "\n");
                                }
                            }
                        }

                        textData.append("\n");
                        textData.append(spacesBetween("SUBTOTAL", subtotal, " ") + "\n");
                        textData.append(spacesBetween("TAX", tax, " ") + "\n");

                        builder.addText(textData.toString());
                        textData.delete(0, textData.length());

                        //TODO Add top logo to command buffer
                       /* builder.addImage(logoData, 0, 0,
                                         logoData.getWidth(),
                                         logoData.getHeight(),
                                         Builder.COLOR_1,
                                         Builder.MODE_MONO,
                                         Builder.HALFTONE_DITHER,
                                         Builder.PARAM_DEFAULT,
                                         getCompress(connectionType)); */


                        builder.addTextDouble(Builder.TRUE, Builder.TRUE);
                        builder.addText("TOTAL         " + total + "\n");
                        builder.addTextDouble(Builder.FALSE, Builder.FALSE);
                        builder.addFeedLine(1);

                        builder.addText(paddedLine("-") + "\n");

                        builder.addFeedLine(2);

                        if(receiptMessage != null && !receiptMessage.isEmpty()) {
                            builder.addText(receiptMessage + "\n");
                            builder.addText(paddedLine("-") + "\n");
                        }


                        // Add barcode data to command buffer
                        builder.addBarcode(barcode,
                                Builder.BARCODE_CODE39,
                                Builder.HRI_BELOW,
                                Builder.FONT_A,
                                barcodeWidth,
                                barcodeHeight);

                        // Add command to cut receipt to command buffer
                        builder.addCut(Builder.CUT_FEED);

                    } catch (JSONException e) {
                        e.printStackTrace();
                        LOG.e("ESCPOS", "Data Error: " + e.getMessage(), e);
                    }

                }

                if(cashDrawCommand) {
                    builder.addPulse(Builder.DRAWER_1, Builder.PULSE_100);
                }

                printer.openPrinter(selectedPrinterType, selectedPrinterAddress, Print.TRUE,
                        Print.PARAM_DEFAULT);
                printer.sendData(builder, 10000, status, battery);
                //printer.closePrinter();

            } catch(EposException e) {
                e.printStackTrace();

                //Acquire the error status
                errStatus = e.getErrorStatus();

                //Acquire the printer status
                status[0] = e.getPrinterStatus();

                //Acquire the battery status
                battery[0] = e.getBatteryStatus();

                LOG.e("ESCPOS", "ErrStatus: " + errStatus + "; Status: " + status[0] + "; Battery: " + battery[0], e);

                success = false;
            } finally {
                printer.closePrinter();
            }
        }

        return success;
    }

    private String paddedLine(String padCharacter) {
        return spacesBetween(null, null, padCharacter);
    }

    private String spacesBetween(String startingWord, String endingWord, String padCharacter) {
        int lineLength = selectedLineLength < 1 ? LINE_LENGTH_MEDIUM : selectedLineLength;
        String start = startingWord != null ? startingWord : "";
        String end = endingWord != null ? endingWord : "";

        int paddingLength = lineLength - start.length() - end.length();

        StringBuilder padding = new StringBuilder();
        for(int i = 0; i < paddingLength; i++) {
            padding.append(padCharacter);
        }

        return start + padding.toString() + end;
    }

    public boolean printText(String printData) throws EposException {
        boolean success = true;

        Print printer = new Print(cordova.getActivity().getApplicationContext());

        int errStatus = 0;
        int[] status = new int[1];
        int[] battery = new int[1];
        status[0] = 0;
        battery[0] = 0;

        if(printData == null || printData.trim().isEmpty()) {
            success = false;
        } else {

            try {
                //Initialize a Builder class instance
                Builder builder = new Builder(selectedPrinterName, Builder.MODEL_ANK);

                builder.addTextLang(Builder.LANG_EN);
                builder.addTextSmooth(Builder.TRUE);
                builder.addTextFont(Builder.FONT_A);
                builder.addTextSize(1, 1);
                builder.addTextAlign(Builder.ALIGN_LEFT);
                builder.addTextStyle(
                        Builder.FALSE,
                        Builder.FALSE,
                        Builder.TRUE,
                        Builder.PARAM_UNSPECIFIED);

                builder.addText(printData);

                printer.openPrinter(selectedPrinterType, selectedPrinterAddress, Print.TRUE,
                        Print.PARAM_DEFAULT);
                printer.sendData(builder, 10000, status, battery);
                //printer.closePrinter();

            } catch (EposException e) {
                e.printStackTrace();

                //Acquire the error status
                errStatus = e.getErrorStatus();

                //Acquire the printer status
                status[0] = e.getPrinterStatus();

                //Acquire the battery status
                battery[0] = e.getBatteryStatus();

                LOG.e("PRINT", "ErrStatus: " + errStatus + "; Status: " + status[0] + "; Battery: " + battery[0], e);

                success = false;
            } finally {
                printer.closePrinter();
            }
        }

        return success;
    }

    public boolean sendEscPosCommands(String commands) {
        boolean success = true;

        //Initialize the EpsonIo class
        EpsonIo mPort = new EpsonIo();
        int errStatus = IoStatus.SUCCESS;

        //Settings for sending
        byte[] data = commands.getBytes();
        int offset = 0;
        int size = data.length;
        int timeout = 5000;
        int sizeWritten = 0;
        int sizeRead = 0;

        if(commands == null || commands.trim().isEmpty()) {
            success = false;
        } else {
            //Open the device port
            try {
                ////USB device
                mPort.open(resolveDeviceType(), selectedPrinterAddress, null, cordova.getActivity().getApplicationContext());
                //Send data
                sizeWritten = mPort.write(data, offset, size, timeout);
                //Receive Data
                //sizeRead = mPort.read(data, offset, size, timeout);
                //Close device port
                mPort.close();
                //Exception handling
            } catch (EpsonIoException e) {
                errStatus = e.getStatus();
            }
        }

        return success;
    }

    private int resolveDeviceType() {
        int deviceType = DevType.USB;
        switch(selectedPrinterType) {
            case Print.DEVTYPE_BLUETOOTH:
                deviceType = DevType.BLUETOOTH;
                break;
            case Print.DEVTYPE_TCP:
                deviceType = DevType.TCP;
                break;
            case Print.DEVTYPE_USB:
            default:
                deviceType = DevType.USB;
        }

        return deviceType;
    }

    public JSONArray searchAndSelectPrinters() throws EpsonIoException {
        DeviceInfo[] printersList = searchPrinters();
        JSONArray printers = new JSONArray();

        if(printersList != null && printersList.length > 0) {
            String name = null;
            String address = null;
            Integer type = null;

            for(int i=0; i<printersList.length; i++){
                name = printersList[i].getPrinterName();
                address = printersList[i].getDeviceName();
                type = printersList[i].getDeviceType();

                JSONObject item = new JSONObject();
                try {
                    item.put("printer-name", name);
                    item.put("printer-address", address);
                    item.put("printer-type", type);
                } catch (JSONException e) {
                    continue;
                }

                //add to list
                printers.put(item);

                //select the printer if its the only one
                if(printersList.length == 1) {
                    selectPrinter(name, address, type);
                }
            }

            return printers;
        }

        return null;
    }

    private boolean selectPrinter(String printerName, String printerAddress, Integer printerType) {
        if(printerName != null && !printerName.isEmpty()
                && printerType != null
                && printerAddress != null && !printerAddress.isEmpty()) {
            selectedPrinterName = printerName.toUpperCase();
            selectedPrinterType = printerType;
            selectedPrinterAddress = printerAddress;

            return true;
        }

        return false;
    }

    public DeviceInfo[] searchPrinters() throws EpsonIoException {
        //start search
        startPrinterSearch();

        //get list
        DeviceInfo[] printersList = retrievePrinterList();

        //stop search
        stopPrinterSearch();

        return printersList;
    }

    private void startPrinterSearch() throws EpsonIoException {
        stopPrinterSearch();

        Finder.start(cordova.getActivity().getApplicationContext(), DevType.USB, "null");

        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {

        }
    }

    private DeviceInfo[] retrievePrinterList() throws EpsonIoException {
        return Finder.getDeviceInfoList(FilterOption.PARAM_DEFAULT);
    }

    private void stopPrinterSearch() {
        //stop old finder
        while(true) {
            try{
                Finder.stop();
                break;
            }catch(EpsonIoException e){
                if(e.getStatus() != IoStatus.ERR_PROCESSING){
                    break;
                }
            }
        }
    }
}