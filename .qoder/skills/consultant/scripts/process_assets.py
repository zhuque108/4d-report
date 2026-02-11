#!/usr/bin/env python3
"""Process assets folder files to extract metadata and convert content to JSON format."""

import json
import os
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Any, Optional


def extract_pdf_content(pdf_path: Path) -> Dict[str, Any]:
    """Extract text content from PDF file.
    
    Args:
        pdf_path: Path to the PDF file
        
    Returns:
        Dictionary containing PDF metadata and extracted text content
    """
    result = {
        "file_type": "pdf",
        "extracted_text": "",
        "pages": 0,
        "extraction_method": "PyPDF2",
        "extraction_status": "pending"
    }
    
    try:
        import PyPDF2
        
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            result["pages"] = len(pdf_reader.pages)
            
            text_content = []
            for page_num, page in enumerate(pdf_reader.pages):
                try:
                    page_text = page.extract_text()
                    if page_text:
                        text_content.append(f"=== Page {page_num + 1} ===\n{page_text}")
                except Exception as e:
                    text_content.append(f"=== Page {page_num + 1} ===\n[Extraction error: {str(e)}]")
            
            result["extracted_text"] = "\n\n".join(text_content)
            result["extraction_status"] = "success"
            
    except ImportError:
        result["extraction_status"] = "error"
        result["error_message"] = "PyPDF2 not installed. Install with: pip install PyPDF2"
    except Exception as e:
        result["extraction_status"] = "error"
        result["error_message"] = str(e)
    
    return result


def extract_image_metadata(image_path: Path) -> Dict[str, Any]:
    """Extract metadata from image file.
    
    Args:
        image_path: Path to the image file
        
    Returns:
        Dictionary containing image metadata and description
    """
    result = {
        "file_type": "image",
        "image_format": image_path.suffix.lower().replace(".", ""),
        "description": "",
        "content_summary": ""
    }
    
    # Add content description based on filename
    filename = image_path.stem
    if "身高百分位查询表" in filename:
        if "男" in filename:
            result["description"] = "中国0-18岁男孩身高体重百分位查询表"
            result["content_summary"] = "包含男孩从出生到18岁的身高和体重百分位数据，涵盖3rd、10th、25th、50th、75th、90th、97th七个百分位点，用于评估男孩生长发育情况"
        elif "女" in filename:
            result["description"] = "中国0-18岁女孩身高体重百分位查询表"
            result["content_summary"] = "包含女孩从出生到18岁的身高和体重百分位数据，涵盖3rd、10th、25th、50th、75th、90th、97th七个百分位点，用于评估女孩生长发育情况"
    
    # Try to get image dimensions if PIL is available
    try:
        from PIL import Image
        with Image.open(image_path) as img:
            result["dimensions"] = {
                "width": img.width,
                "height": img.height
            }
            result["mode"] = img.mode
    except ImportError:
        result["dimensions"] = "PIL not installed, dimensions unavailable"
    except Exception as e:
        result["dimensions"] = f"Error reading dimensions: {str(e)}"
    
    return result


def get_file_metadata(file_path: Path) -> Dict[str, Any]:
    """Get basic file metadata.
    
    Args:
        file_path: Path to the file
        
    Returns:
        Dictionary containing file metadata
    """
    stat = file_path.stat()
    
    return {
        "filename": file_path.name,
        "file_path": str(file_path.relative_to(Path(__file__).parent.parent)),
        "file_size_bytes": stat.st_size,
        "file_size_human": format_file_size(stat.st_size),
        "created_time": datetime.fromtimestamp(stat.st_ctime).isoformat(),
        "modified_time": datetime.fromtimestamp(stat.st_mtime).isoformat(),
        "file_extension": file_path.suffix.lower()
    }


def format_file_size(size_bytes: int) -> str:
    """Format file size in human-readable format.
    
    Args:
        size_bytes: File size in bytes
        
    Returns:
        Human-readable file size string
    """
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size_bytes < 1024.0:
            return f"{size_bytes:.2f} {unit}"
        size_bytes /= 1024.0
    return f"{size_bytes:.2f} TB"


def process_assets_folder(assets_dir: Path) -> Dict[str, Any]:
    """Process all files in the assets folder.
    
    Args:
        assets_dir: Path to the assets directory
        
    Returns:
        Dictionary containing metadata for all processed files
    """
    result = {
        "metadata_version": "3.0",
        "generated_at": datetime.now().isoformat(),
        "total_files": 0,
        "files": {}
    }
    
    if not assets_dir.exists():
        result["error"] = f"Assets directory not found: {assets_dir}"
        return result
    
    # Process each file in the assets folder
    for file_path in sorted(assets_dir.iterdir()):
        if file_path.is_file():
            file_key = file_path.stem
            result["total_files"] += 1
            
            # Get basic metadata
            file_data = get_file_metadata(file_path)
            
            # Extract content based on file type
            if file_path.suffix.lower() == '.pdf':
                file_data.update(extract_pdf_content(file_path))
            elif file_path.suffix.lower() in ['.jpg', '.jpeg', '.png', '.gif', '.bmp']:
                file_data.update(extract_image_metadata(file_path))
            else:
                file_data["file_type"] = "unknown"
                file_data["content"] = "Unsupported file type"
            
            result["files"][file_key] = file_data
    
    return result


def main():
    """Main entry point."""
    # Get the script directory and assets directory
    script_dir = Path(__file__).parent
    assets_dir = script_dir.parent / "assets"
    output_file = script_dir.parent / "assets_metadata.json"
    
    print(f"Processing assets in: {assets_dir}")
    print(f"Output will be saved to: {output_file}")
    
    # Process all assets
    metadata = process_assets_folder(assets_dir)
    
    # Save to JSON file
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(metadata, f, ensure_ascii=False, indent=2)
    
    print(f"\n[SUCCESS] Successfully processed {metadata['total_files']} files")
    print(f"[OUTPUT] Metadata saved to: {output_file}")
    
    # Print summary
    print("\n[FILES] Files processed:")
    for file_key, file_data in metadata["files"].items():
        file_type = file_data.get("file_type", "unknown")
        size = file_data.get("file_size_human", "unknown")
        status = "[OK]" if file_data.get("extraction_status") != "error" else "[WARN]"
        print(f"  {status} {file_key} ({file_type}, {size})")
    
    return metadata


if __name__ == '__main__':
    main()
