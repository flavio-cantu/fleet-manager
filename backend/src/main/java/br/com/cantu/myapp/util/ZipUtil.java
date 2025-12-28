package br.com.cantu.myapp.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

public class ZipUtil {

    private static final Logger LOG = LoggerFactory.getLogger(ZipUtil.class);

    public static void compressFolderToZip(Path folder, ZipOutputStream zipOutputStream) throws IOException {
        try {
            Files.walk(folder)
                    .filter(path -> !Files.isDirectory(path))
                    .forEach(file -> {
                        try {
                            addFileToZip(folder, file, zipOutputStream);
                        } catch (IOException e) {
                            throw new RuntimeException("Erro ao adicionar arquivo ao ZIP: " + e.getMessage(), e);
                        }
                    });
        } catch (RuntimeException e) {
            if (e.getCause() instanceof IOException) {
                throw (IOException) e.getCause();
            }
            throw new IOException("Erro durante compactação: " + e.getMessage(), e);
        }
    }

    /**
     * Adiciona um arquivo individual ao ZIP
     */
    private static void addFileToZip(Path rootFolder, Path file, ZipOutputStream zipOutputStream) throws IOException {
        String relativePath = rootFolder.relativize(file).toString().replace("\\", "/");

        ZipEntry zipEntry = new ZipEntry(relativePath);
        zipEntry.setSize(Files.size(file));
        zipEntry.setTime(System.currentTimeMillis());

        zipOutputStream.putNextEntry(zipEntry);
        Files.copy(file, zipOutputStream);
        zipOutputStream.closeEntry();

        if (Files.isDirectory(file.getParent())) {
            try {
                long fileCount = Files.list(file.getParent()).count();
                if (fileCount % 500 == 0) {
                    LOG.info("Compactação progresso: {} arquivos processados", fileCount);
                }
            } catch (IOException e) {
                // Ignora erro de contagem para logging
            }
        }
    }

}
