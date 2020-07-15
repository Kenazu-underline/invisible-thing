import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FiUpload } from 'react-icons/fi';

import './styles.css'

interface Props {
  onFileUploaded: (file: File) => void;
}

const Dropzone: React.FC<Props> = ({ onFileUploaded }) => {
  const [selectedFileUrl, setSelectedFileUrl] = useState("");

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];

    if ( !file ){
      alert("It is necessary to chose a mp3 audio file!")
      return false;
    }

    const fileUrl = URL.createObjectURL(file);

    setSelectedFileUrl(fileUrl);
    onFileUploaded(file);
  }, [onFileUploaded])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'audio/mpeg'
  })

  return (
    <div className="dropsound" {...getRootProps()}>
      <input {...getInputProps()} accept='audio/mpeg' />

      {selectedFileUrl
        ? <div>
          <span className='p'>
            <FiUpload />
            <span className='tooltip'>Audio
            <span className="tooltiptext">
                <ul>
                  <li>
                    Recomenda-se audios com duração inferior a 5s
                    </li>
                  <li>
                    O arquivo deve ter no máximo 2Mb
                    </li>
                  <li>
                  Duração máxima de 30s (recortado automaticamente)
                    </li>
                </ul>
              </span>
            </span>
          </span>
          <div>
            <audio src={selectedFileUrl} controls />
          </div>
        </div>
        : (
          <span className='p'>
            <FiUpload />
            <span className='tooltip'>Audio
            <span className="tooltiptext">
                <ul>
                  <li>
                    It is recomended to use audio files with duration less than 5 seconds.
                  </li>
                  <li>
                    File size must be less than 2 MB.
                  </li>
                  <li>
                    Max audio duration is 10 seconds (automatically trimmed).
                  </li>
                </ul>
              </span>
            </span>
          </span>
        )
      }


    </div>
  )
}

export default Dropzone;