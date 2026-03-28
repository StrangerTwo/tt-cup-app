import { ChangeEventHandler, FC } from "react";
import { twMerge } from "tailwind-merge";

import { UploadIcon } from "../icons";
import { Card } from "../ui/Card";
import { useColorLayer } from "../ui/layout/ColorLayer";

type Props = {
    className?: string;
    subtitle?: string;
} & (
    | {
          onFileUpload: (fileList: FileList) => void;
          multiple: true;
      }
    | {
          onFileUpload: (file: File) => void;
          multiple?: false;
      }
);

export const FileDropzone: FC<Props> = ({ className, onFileUpload, subtitle, multiple }) => {
    const { hoverBgColor } = useColorLayer(0);
    const { textColor } = useColorLayer(1);

    const onInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        const files = e.target.files;
        if (files == null) {
            return;
        }
        if (multiple) {
            onFileUpload(files);
        } else {
            onFileUpload(files[0]);
        }
    };

    return (
        <label htmlFor="dropzone-file" className={className}>
            <Card
                layerStep={2}
                className={twMerge(
                    hoverBgColor,
                    "flex h-64 cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed",
                )}>
                <UploadIcon className="size-8" />
                <p className="text-sm">
                    <span className="font-semibold">Nahrajte kliknutím</span> nebo přetáhněte sem
                </p>
                {subtitle && <p className={twMerge("text-xs", textColor)}>{subtitle}</p>}
            </Card>
            <input id="dropzone-file" type="file" multiple={multiple} className="hidden" onChange={onInputChange} />
        </label>
    );
};
