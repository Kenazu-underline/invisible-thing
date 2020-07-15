import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FiUpload } from 'react-icons/fi';

import './styles.css'

interface Props{
  onFileUploaded: (file: File) => void;
}

const Dropzone: React.FC<Props> = ({ onFileUploaded }) => {
  const [selectedFileUrl, setSelectedFileUrl] = useState("");

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];
    if ( !file ){
      alert('It is necessary to chose a valid image!')
      return false;
    }
    
    const fileUrl = URL.createObjectURL(file);

    setSelectedFileUrl(fileUrl);
    onFileUploaded(file);
  }, [onFileUploaded])
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*'
  })

  return (
    <div className="dropimage" {...getRootProps()}>
      <input {...getInputProps()} accept='image/*' />

      {selectedFileUrl
        ? <div>
            <span className='p'>
              <FiUpload />
              <span className='tooltip'>Imagem
                <span className="tooltiptext">
                  <ul>
                    <li>
                      It is recomended to use a square PNG image with transparency and with a resolution of 128x128 pixels.
                    </li>
                    <li>
                      File size must be less than 2 MB.
                    </li>
                  </ul>
                </span>
              </span>
            </span>
            <img src={selectedFileUrl} alt="Point thumbnail" />
            </div>
        : (
          <span className='p'>
            <FiUpload />
            <span className='tooltip'>Image
            <span className="tooltiptext">
                  <ul>
                  <li>
                      It is recomended to use a square PNG image with transparency and with a resolution of 128x128 pixels.
                    </li>
                    <li>
                      File size must be less than 2 MB.
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